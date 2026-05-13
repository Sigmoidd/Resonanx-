import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CHORDS = {
  G: { name: "G Major", notes: ["G", "B", "D"], color: "#D4A043" },
  C: { name: "C Major", notes: ["C", "E", "G"], color: "#C4784A" },
  D: { name: "D Major", notes: ["D", "F#", "A"], color: "#8B6E4E" },
  Em: { name: "E Minor", notes: ["E", "G", "B"], color: "#6B8E6B" },
  Am: { name: "A Minor", notes: ["A", "C", "E"], color: "#7B6B8E" },
  A: { name: "A Major", notes: ["A", "C#", "E"], color: "#9E7B4A" },
  E: { name: "E Major", notes: ["E", "G#", "B"], color: "#4A7C8A" },
  F: { name: "F Major", notes: ["F", "A", "C"], color: "#6E8B5E" },
};

const HARMONY = {
  G: ["Em", "C", "D"],
  C: ["Am", "Em", "G"],
  D: ["Bm", "G", "A"],
  Em: ["G", "C", "Am"],
  Am: ["C", "F", "Em"],
  A: ["D", "E"],
  E: ["A", "C"],
  F: ["Dm", "Am", "C"],
};

const SONGS = [
  { name: "Amazing Grace", chords: ["G", "C", "G", "D", "G"] },
  { name: "Knockin' on Heaven's Door", chords: ["G", "D", "Am", "G", "D", "C"] },
  { name: "Horse With No Name", chords: ["Em", "D", "Em", "D"] },
  { name: "Let It Be", chords: ["G", "D", "Em", "C"] },
  { name: "Simple G-C-D", chords: ["G", "C", "D", "G"] },
];

const SK = {
  profiles: "resonanx:profiles",
  sessions: (id) => `resonanx:sessions:${id}`,
  favorites: (id) => `resonanx:favorites:${id}`,
};

const ROOM_PREFIX = "resonanx-room:";
const RELAY_BASE = (import.meta.env.VITE_RELAY_URL || "").replace(/\/$/, "");

function safeRoom(room) {
  return (room || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function relaySet(room, kind, data) {
  const code = safeRoom(room);
  const payload = { ...data, ts: Date.now() };
  if (!code) return payload;
  try {
    const res = await fetch(`${RELAY_BASE}/api/room/${code}/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`relay ${res.status}`);
    return payload;
  } catch {
    saveLocal(`${ROOM_PREFIX}${code}:${kind}`, payload);
    return payload;
  }
}

async function relayGet(room, kind) {
  const code = safeRoom(room);
  if (!code) return null;
  try {
    const res = await fetch(`${RELAY_BASE}/api/room/${code}/${kind}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`relay ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch {
    return loadLocal(`${ROOM_PREFIX}${code}:${kind}`, null);
  }
}

function randomRoom() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function playTone(kind = "spark") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = kind === "love" ? 528 : kind === "applause" ? 660 : 880;
    osc.type = kind === "love" ? "sine" : "triangle";
    osc.frequency.value = freq;
    gain.gain.value = 0.0001;
    gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
    setTimeout(() => ctx.close(), 900);
  } catch {}
}

function reactionLabel(kind) {
  if (kind === "love") return "Love";
  if (kind === "applause") return "Applause";
  return "Spark";
}

function reactionIcon(kind) {
  if (kind === "love") return "❤️";
  if (kind === "applause") return "👏";
  return "✦";
}

function Bloom({ glow, pulse, reaction }) {
  const kind = reaction?.kind;
  const warmth = kind === "love" ? "255,120,150" : kind === "applause" ? "255,210,120" : "170,220,255";
  const scale = 1 + glow * 0.16 + pulse * 0.2;
  return (
    <div style={S.bloomWrap}>
      <div
        style={{
          ...S.bloom,
          transform: `scale(${scale})`,
          boxShadow: `0 0 ${30 + glow * 95 + pulse * 60}px rgba(${warmth}, ${0.14 + glow * 0.3 + pulse * 0.28})`,
          background: `radial-gradient(circle, rgba(255,230,180,${0.35 + glow * 0.45}) 0%, rgba(${warmth},${0.16 + glow * 0.3}) 42%, rgba(0,0,0,0) 72%)`,
        }}
      />
      {reaction && (
        <div style={S.reactionAura}>
          <span style={{ fontSize: 34 }}>{reactionIcon(kind)}</span>
          <span>{reaction.from || "Family"} sent {reactionLabel(kind)}</span>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={S.section}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function Button({ active, children, style, ...props }) {
  return (
    <button style={{ ...S.button, ...(active ? S.buttonActive : {}), ...style }} {...props}>
      {children}
    </button>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [profiles, setProfiles] = useState(() => loadLocal(SK.profiles, []));
  const [profileName, setProfileName] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [mode, setMode] = useState("player");
  const [room, setRoom] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [songName, setSongName] = useState(SONGS[0].name);
  const [idx, setIdx] = useState(0);
  const [glow, setGlow] = useState(0.2);
  const [successCount, setSuccessCount] = useState(0);
  const [sessionLog, setSessionLog] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [live, setLive] = useState(null);
  const [leadChord, setLeadChord] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [pulse, setPulse] = useState(0);
  const [favoriteTitle, setFavoriteTitle] = useState("");
  const [favoriteNote, setFavoriteNote] = useState("");
  const reactionTs = useRef(0);
  const startedAt = useRef(null);

  const profile = profiles.find((p) => p.id === profileId) || null;
  const selectedSong = SONGS.find((s) => s.name === songName) || SONGS[0];
  const harmonyChord = leadChord ? (HARMONY[leadChord]?.[0] || leadChord) : null;
  const targetChord = mode === "player" && harmonyChord ? harmonyChord : selectedSong.chords[idx] || "G";
  const chordInfo = CHORDS[targetChord] || CHORDS.G;

  useEffect(() => saveLocal(SK.profiles, profiles), [profiles]);

  useEffect(() => {
    if (!profileId) return;
    setSessions(loadLocal(SK.sessions(profileId), []));
    setFavorites(loadLocal(SK.favorites(profileId), []));
  }, [profileId]);

  useEffect(() => {
    if (view !== "play" || mode !== "player" || !room) return;
    const code = safeRoom(room);
    const timer = setInterval(() => {
      relaySet(code, "live", {
        profileName: profile?.name || "Player",
        song: selectedSong.name,
        targetChord,
        leadChord,
        harmonyChord,
        glow,
        successCount,
        chordCount: sessionLog.length,
        startedAt: startedAt.current,
      });
    }, 650);
    return () => clearInterval(timer);
  }, [view, mode, room, profile?.name, selectedSong.name, targetChord, leadChord, harmonyChord, glow, successCount, sessionLog.length]);

  useEffect(() => {
    if (view !== "play" || mode !== "player" || !room) return;
    const timer = setInterval(async () => {
      const chord = await relayGet(room, "chord");
      if (chord?.chord) setLeadChord(chord.chord);
      const nextReaction = await relayGet(room, "reaction");
      if (nextReaction?.ts && nextReaction.ts > reactionTs.current) {
        reactionTs.current = nextReaction.ts;
        setReaction(nextReaction);
        setPulse(1);
        playTone(nextReaction.kind);
        if (navigator.vibrate) {
          const pat = nextReaction.kind === "love" ? [90, 60, 140] : nextReaction.kind === "applause" ? [90, 40, 90, 40, 120] : [80];
          navigator.vibrate(pat);
        }
        setTimeout(() => setReaction(null), 3600);
      }
    }, 700);
    return () => clearInterval(timer);
  }, [view, mode, room]);

  useEffect(() => {
    if (view !== "play" || mode !== "family" || !room) return;
    const timer = setInterval(async () => {
      setLive(await relayGet(room, "live"));
    }, 700);
    return () => clearInterval(timer);
  }, [view, mode, room]);

  useEffect(() => {
    if (view !== "play" || mode !== "player") return;
    const decay = setInterval(() => {
      setPulse((p) => Math.max(0, p - 0.08));
      setGlow((g) => Math.max(0.08, g - 0.01));
    }, 120);
    return () => clearInterval(decay);
  }, [view, mode]);

  const createProfile = () => {
    const name = profileName.trim();
    if (!name) return;
    const next = { id: Date.now().toString(36), name, createdAt: new Date().toISOString() };
    setProfiles([...profiles, next]);
    setProfileId(next.id);
    setProfileName("");
    setView("setup");
  };

  const begin = () => {
    if (!room) setRoom(randomRoom());
    setIdx(0);
    setGlow(0.22);
    setPulse(0);
    setSuccessCount(0);
    setSessionLog([]);
    setReaction(null);
    setLive(null);
    setLeadChord(null);
    startedAt.current = Date.now();
    setView("play");
  };

  const endSession = () => {
    if (mode === "player" && profileId && sessionLog.length) {
      const session = {
        id: Date.now().toString(36),
        date: new Date().toISOString(),
        song: selectedSong.name,
        room: safeRoom(room),
        chords: sessionLog,
        chordCount: sessionLog.length,
        duration: Math.round((Date.now() - (startedAt.current || Date.now())) / 1000),
      };
      const updated = [session, ...sessions].slice(0, 100);
      setSessions(updated);
      saveLocal(SK.sessions(profileId), updated);
    }
    setView("setup");
  };

  const landChord = () => {
    const entry = { chord: targetChord, at: new Date().toISOString(), score: Math.min(1, glow + 0.25).toFixed(2) };
    setSessionLog((log) => [...log, entry]);
    setSuccessCount((n) => n + 1);
    setGlow(1);
    setPulse(1);
    playTone("applause");
    if (navigator.vibrate) navigator.vibrate([90, 40, 90]);
    setIdx((i) => (i + 1 >= selectedSong.chords.length ? 0 : i + 1));
  };

  const saveFavorite = () => {
    if (!profileId || sessionLog.length === 0) return;
    const fav = {
      id: Date.now().toString(36),
      date: new Date().toISOString(),
      title: favoriteTitle.trim() || `${profile?.name || "Player"} - ${selectedSong.name}`,
      note: favoriteNote.trim(),
      song: selectedSong.name,
      room: safeRoom(room),
      chords: sessionLog,
      chordCount: sessionLog.length,
      duration: Math.round((Date.now() - (startedAt.current || Date.now())) / 1000),
    };
    const updated = [fav, ...favorites].slice(0, 50);
    setFavorites(updated);
    saveLocal(SK.favorites(profileId), updated);
    setFavoriteTitle("");
    setFavoriteNote("");
  };

  const sendFamilyReaction = async (kind) => {
    const payload = await relaySet(room, "reaction", { kind, from: familyName.trim() || "Family" });
    setLive((l) => ({ ...(l || {}), lastReaction: payload }));
    playTone(kind);
  };

  const sendLeadChord = async (chord) => {
    setLeadChord(chord);
    await relaySet(room, "chord", { chord });
  };

  const dashboardStats = useMemo(() => {
    const totalChords = sessions.reduce((a, s) => a + (s.chordCount || 0), 0);
    const minutes = Math.round(sessions.reduce((a, s) => a + (s.duration || 0), 0) / 60);
    return { totalChords, minutes };
  }, [sessions]);

  if (view === "home") {
    return (
      <main style={S.page}>
        <section style={S.card}>
          <div style={S.mark}>✦</div>
          <h1 style={S.title}>Resonanx</h1>
          <p style={S.subtitle}>A family music room for Exodia Stage Hand.</p>
          <p style={S.copy}>Built for connection first: the player gets glow, sound, and gentle family energy instead of a clinical screen.</p>
          <Field label="Player profiles">
            {profiles.length === 0 && <p style={S.hint}>Create a profile to start.</p>}
            {profiles.map((p) => (
              <Button key={p.id} onClick={() => { setProfileId(p.id); setView("setup"); }}>
                <strong>{p.name}</strong>
                <span style={S.muted}>Start or review sessions</span>
              </Button>
            ))}
          </Field>
          <Field label="New profile">
            <div style={S.row}>
              <input style={S.input} value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Name" />
              <button style={S.smallButton} onClick={createProfile}>Create</button>
            </div>
          </Field>
        </section>
      </main>
    );
  }

  if (view === "setup") {
    return (
      <main style={S.page}>
        <section style={S.card}>
          <div style={S.topbar}>
            <button style={S.linkButton} onClick={() => setView("home")}>← Profiles</button>
            <button style={S.linkButton} onClick={() => setView("dashboard")}>Dashboard →</button>
          </div>
          <h1 style={S.title}>{profile?.name || "Session"}</h1>
          <Field label="Mode">
            <Button active={mode === "player"} onClick={() => setMode("player")}>🎸 Player session <span style={S.muted}>solo, local, or remote family room</span></Button>
            <Button active={mode === "lead"} onClick={() => setMode("lead")}>🎸 Lead side <span style={S.muted}>send chord changes to the player</span></Button>
            <Button active={mode === "family"} onClick={() => setMode("family")}>👨‍👩‍👧‍👦 Family join-in <span style={S.muted}>watch live and send sensory encouragement</span></Button>
          </Field>
          <Field label="Room code">
            <div style={S.row}>
              <input style={{ ...S.input, textTransform: "uppercase", letterSpacing: 3 }} value={room} onChange={(e) => setRoom(safeRoom(e.target.value))} placeholder="ABC123" />
              <button style={S.smallButton} onClick={() => setRoom(randomRoom())}>Generate</button>
            </div>
            <p style={S.hint}>Share this code with family. On Cloudflare, rooms sync through the Durable Object relay.</p>
          </Field>
          {mode === "family" && (
            <Field label="Family name">
              <input style={S.input} value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Mom, brother, Christian..." />
            </Field>
          )}
          {mode === "player" && (
            <Field label="Song">
              {SONGS.map((song) => (
                <Button key={song.name} active={song.name === songName} onClick={() => setSongName(song.name)}>
                  {song.name}
                  <span style={S.muted}>{song.chords.join(" → ")}</span>
                </Button>
              ))}
            </Field>
          )}
          <button style={S.startButton} onClick={begin}>Begin</button>
        </section>
      </main>
    );
  }

  if (view === "dashboard") {
    return (
      <main style={S.page}>
        <section style={S.card}>
          <div style={S.topbar}>
            <button style={S.linkButton} onClick={() => setView("setup")}>← Setup</button>
          </div>
          <h1 style={S.title}>Family memories</h1>
          <div style={S.statGrid}>
            <div style={S.stat}><strong>{sessions.length}</strong><span>Sessions</span></div>
            <div style={S.stat}><strong>{dashboardStats.totalChords}</strong><span>Chords</span></div>
            <div style={S.stat}><strong>{dashboardStats.minutes}</strong><span>Minutes</span></div>
            <div style={S.stat}><strong>{favorites.length}</strong><span>Favorites</span></div>
          </div>
          <Field label="Favorite performances">
            {favorites.length === 0 && <p style={S.hint}>Saved performances will show here.</p>}
            {favorites.map((f) => (
              <div key={f.id} style={S.memory}>
                <strong>★ {f.title}</strong>
                <span>{new Date(f.date).toLocaleString()} · {f.chordCount} chords · {Math.round((f.duration || 0) / 60)} min</span>
                {f.note && <p>{f.note}</p>}
                <div style={S.chipRow}>{f.chords.slice(0, 16).map((c, i) => <span key={i} style={S.chip}>{c.chord}</span>)}</div>
              </div>
            ))}
          </Field>
        </section>
      </main>
    );
  }

  if (view === "play" && mode === "family") {
    const g = Number(live?.glow || 0);
    return (
      <main style={S.playPage}>
        <div style={S.playHeader}>
          <button style={S.linkButton} onClick={() => setView("setup")}>← Leave</button>
          <span style={S.badge}>Room {safeRoom(room)}</span>
        </div>
        <section style={S.centerStage}>
          <p style={S.overline}>Family join-in</p>
          <h1 style={S.title}>{live?.profileName || "Waiting for player..."}</h1>
          <p style={S.subtitle}>{live?.song || "The music will appear here when the session starts."}</p>
          <Bloom glow={g} pulse={0} reaction={live?.lastReaction} />
          <div style={S.bigChord}>{live?.targetChord || "—"}</div>
          <p style={S.copy}>Glow {Math.round(g * 100)}% · {live?.chordCount || 0} chords landed</p>
          <div style={S.reactionRow}>
            <button style={S.reactionButton} onClick={() => sendFamilyReaction("spark")}>✦ Spark</button>
            <button style={S.reactionButton} onClick={() => sendFamilyReaction("applause")}>👏 Applause</button>
            <button style={S.reactionButton} onClick={() => sendFamilyReaction("love")}>❤️ Love</button>
          </div>
          <p style={S.hint}>These feed the player side as bloom pulse, soft sound, and optional haptic vibration.</p>
        </section>
      </main>
    );
  }

  if (view === "play" && mode === "lead") {
    return (
      <main style={S.playPage}>
        <div style={S.playHeader}>
          <button style={S.linkButton} onClick={() => setView("setup")}>← End</button>
          <span style={S.badge}>Room {safeRoom(room)}</span>
        </div>
        <section style={S.centerStage}>
          <p style={S.overline}>Lead side</p>
          <h1 style={S.title}>Send the chord</h1>
          <p style={S.subtitle}>The player receives a friendly harmony target.</p>
          <div style={S.chordPad}>{Object.keys(CHORDS).map((c) => <button key={c} style={{ ...S.chordButton, ...(leadChord === c ? S.chordButtonActive : {}) }} onClick={() => sendLeadChord(c)}>{c}</button>)}</div>
          {leadChord && <p style={S.copy}>Lead: {leadChord} → player target: {HARMONY[leadChord]?.[0] || leadChord}</p>}
        </section>
      </main>
    );
  }

  return (
    <main style={S.playPage}>
      <div style={S.playHeader}>
        <button style={S.linkButton} onClick={endSession}>← End</button>
        <span style={S.badge}>✦ {successCount}</span>
      </div>
      <section style={S.centerStage}>
        <p style={S.overline}>{safeRoom(room)} · {selectedSong.name}</p>
        <Bloom glow={glow} pulse={pulse} reaction={reaction} />
        <div style={S.bigChord}>{targetChord}</div>
        <p style={S.subtitle}>{chordInfo.name} · {chordInfo.notes.join(" / ")}</p>
        {leadChord && <p style={S.copy}>Lead is playing {leadChord}. Your harmony is {targetChord}.</p>}
        <div style={S.progressBox}>
          <label style={S.label}>Glow / closeness</label>
          <input style={S.slider} type="range" min="0" max="1" step="0.01" value={glow} onChange={(e) => setGlow(Number(e.target.value))} />
          <button style={S.startButton} onClick={landChord}>Chord landed</button>
        </div>
        {sessionLog.length > 0 && (
          <div style={S.saveBox}>
            <label style={S.label}>Save favorite performance</label>
            <input style={S.input} value={favoriteTitle} onChange={(e) => setFavoriteTitle(e.target.value)} placeholder="Dad played Amazing Grace" />
            <input style={S.input} value={favoriteNote} onChange={(e) => setFavoriteNote(e.target.value)} placeholder="Optional family note" />
            <button style={S.smallButton} onClick={saveFavorite}>★ Save favorite</button>
          </div>
        )}
      </section>
    </main>
  );
}

const S = {
  page: { minHeight: "100vh", background: "linear-gradient(160deg,#1a1410,#0d0b09 45%,#12100e)", color: "#e8ddd0", fontFamily: "Georgia, serif", padding: 16 },
  playPage: { minHeight: "100vh", background: "linear-gradient(160deg,#1a1410,#0d0b09 45%,#12100e)", color: "#e8ddd0", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" },
  card: { maxWidth: 620, margin: "0 auto", padding: "24px 4px" },
  mark: { color: "#c8a060", fontSize: 30, letterSpacing: 4 },
  title: { margin: "4px 0", fontWeight: 300, letterSpacing: 1.5, color: "#f0e4d4" },
  subtitle: { color: "#9a8a78", fontSize: 14, fontStyle: "italic", lineHeight: 1.5 },
  copy: { color: "#a89b8e", fontSize: 14, lineHeight: 1.6 },
  section: { margin: "18px 0" },
  label: { display: "block", color: "#9a8a78", textTransform: "uppercase", letterSpacing: 1.5, fontSize: 11, fontWeight: 700, marginBottom: 8 },
  hint: { color: "#76695f", fontSize: 12, lineHeight: 1.5 },
  muted: { display: "block", color: "#7a6a5a", fontSize: 12, marginTop: 3, fontWeight: 400 },
  row: { display: "flex", gap: 8 },
  input: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", color: "#f0e4d4", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 13px", fontSize: 15, marginBottom: 8 },
  button: { width: "100%", textAlign: "left", background: "rgba(255,255,255,0.035)", color: "#e8ddd0", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "13px 14px", marginBottom: 8, cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 15 },
  buttonActive: { background: "rgba(200,160,96,0.13)", borderColor: "rgba(200,160,96,0.36)" },
  smallButton: { background: "rgba(200,160,96,0.2)", border: "1px solid rgba(200,160,96,0.32)", borderRadius: 10, padding: "11px 16px", color: "#f0d8b0", cursor: "pointer", fontFamily: "Georgia, serif" },
  startButton: { width: "100%", background: "linear-gradient(135deg,#8B5E3C,#A0724B)", border: 0, borderRadius: 14, padding: "15px 18px", color: "white", fontFamily: "Georgia, serif", fontSize: 16, cursor: "pointer", boxShadow: "0 4px 30px rgba(140,94,60,0.25)" },
  linkButton: { background: "transparent", border: 0, color: "#a9947d", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 14 },
  topbar: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  playHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16 },
  badge: { color: "#c8a060", fontWeight: 700 },
  centerStage: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" },
  overline: { color: "#7b6b5c", textTransform: "uppercase", letterSpacing: 2, fontSize: 11 },
  bloomWrap: { position: "relative", width: 230, height: 230, display: "grid", placeItems: "center", margin: "20px auto" },
  bloom: { width: 180, height: 180, borderRadius: 1000, transition: "all 240ms ease", border: "1px solid rgba(255,220,170,0.1)" },
  reactionAura: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#ffe0b0", textShadow: "0 0 18px rgba(255,210,140,0.55)", animation: "none" },
  bigChord: { fontSize: 72, fontWeight: 300, letterSpacing: 5, color: "#FFE0B0", margin: "4px 0" },
  progressBox: { width: "100%", maxWidth: 420, marginTop: 18 },
  slider: { width: "100%", accentColor: "#c8a060", marginBottom: 12 },
  reactionRow: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 16 },
  reactionButton: { background: "rgba(255,220,170,0.08)", border: "1px solid rgba(255,220,170,0.18)", borderRadius: 14, color: "#ffe0b0", padding: "12px 16px", cursor: "pointer", fontFamily: "Georgia, serif" },
  chordPad: { display: "grid", gridTemplateColumns: "repeat(4, minmax(64px, 1fr))", gap: 10, width: "100%", maxWidth: 390, margin: "20px auto" },
  chordButton: { borderRadius: 14, padding: "18px 8px", background: "rgba(255,255,255,0.04)", color: "#e8ddd0", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 20, fontFamily: "Georgia, serif" },
  chordButtonActive: { background: "rgba(200,160,96,0.18)", borderColor: "rgba(200,160,96,0.4)", color: "#ffe0b0" },
  saveBox: { width: "100%", maxWidth: 430, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, marginTop: 18 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, margin: "20px 0" },
  stat: { background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 10, textAlign: "center" },
  memory: { background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14, marginBottom: 10, color: "#d8ccc0" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 },
  chip: { background: "rgba(200,160,96,0.14)", border: "1px solid rgba(200,160,96,0.24)", borderRadius: 999, padding: "4px 9px", fontSize: 12, color: "#e0c89d" },
};
