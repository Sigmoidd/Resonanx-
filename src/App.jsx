import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ═══════════════════════════════════════════════════════════════════════
// RESONANCE V3 — FAMILY JOIN-IN + FAVORITE PERFORMANCES
// Exodia Stage Hand / Resonance app
// Focus: family connection, sensory feedback, ambidextrous full build readiness.
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS & MUSIC THEORY
// ═══════════════════════════════════════════════════════════════════════
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const A4 = 440;

const CHORD_LIB = {
  G: { n: ["G", "B", "D"], name: "G Major", color: "#D4A043" },
  C: { n: ["C", "E", "G"], name: "C Major", color: "#C4784A" },
  D: { n: ["D", "F#", "A"], name: "D Major", color: "#8B6E4E" },
  Em: { n: ["E", "G", "B"], name: "E Minor", color: "#6B8E6B" },
  Am: { n: ["A", "C", "E"], name: "A Minor", color: "#7B6B8E" },
  E: { n: ["E", "G#", "B"], name: "E Major", color: "#4A7C8A" },
  A: { n: ["A", "C#", "E"], name: "A Major", color: "#9E7B4A" },
  Dm: { n: ["D", "F", "A"], name: "D Minor", color: "#8A6B7C" },
  F: { n: ["F", "A", "C"], name: "F Major", color: "#6E8B5E" },
  Bm: { n: ["B", "D", "F#"], name: "B Minor", color: "#6A7B8A" },
};

const HARMONY_MAP = {
  G: ["Em", "C", "D"],
  C: ["Am", "Em", "G"],
  D: ["Bm", "G", "A"],
  Em: ["G", "C", "Am"],
  Am: ["C", "F", "Em"],
  E: ["A", "Bm"],
  A: ["D", "E"],
  Dm: ["F", "Am", "C"],
  F: ["Dm", "Am", "C"],
  Bm: ["D", "G", "Em"],
};

const SONGS = [
  { name: "Amazing Grace", chords: ["G", "C", "G", "D", "G"], era: "Traditional" },
  { name: "Knockin’ on Heaven’s Door", chords: ["G", "D", "Am", "G", "D", "C"], era: "70s" },
  { name: "Horse With No Name", chords: ["Em", "D", "Em", "D"], era: "70s" },
  { name: "House of the Rising Sun", chords: ["Am", "C", "D", "F", "Am", "E"], era: "60s" },
  { name: "Let It Be", chords: ["G", "D", "Em", "C"], era: "70s" },
  { name: "Free Fallin’", chords: ["D", "G", "D", "A"], era: "80s" },
  { name: "Blowin’ in the Wind", chords: ["G", "C", "G", "C", "G", "C", "D"], era: "60s" },
  { name: "Simple G-C-D", chords: ["G", "C", "D", "G"], era: "Practice" },
];

// ═══════════════════════════════════════════════════════════════════════
// STORAGE ADAPTER
// Uses window.storage when available, falls back to localStorage for normal browsers.
// Shared room functions need a real backend for cross-device production.
// ═══════════════════════════════════════════════════════════════════════
async function storageGet(key, shared = false) {
  try {
    if (typeof window !== "undefined" && window.storage?.get) {
      const r = await window.storage.get(key, shared);
      return r ? JSON.parse(r.value) : null;
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(`${shared ? "shared:" : "local:"}${key}`);
      return raw ? JSON.parse(raw) : null;
    }
  } catch (e) {
    console.warn("storageGet failed", key, e);
  }
  return null;
}

async function storageSet(key, data, shared = false) {
  try {
    if (typeof window !== "undefined" && window.storage?.set) {
      await window.storage.set(key, JSON.stringify(data), shared);
      return;
    }
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(`${shared ? "shared:" : "local:"}${key}`, JSON.stringify(data));
    }
  } catch (e) {
    console.warn("storageSet failed", key, e);
  }
}

async function load(key, fb) {
  const r = await storageGet(key, false);
  return r ?? fb;
}

async function save(key, data) {
  await storageSet(key, data, false);
}

// ═══════════════════════════════════════════════════════════════════════
// YIN PITCH DETECTION (de Cheveigné & Kawahara, JASA 2002)
// ═══════════════════════════════════════════════════════════════════════
function yinDetect(buffer, sampleRate) {
  const halfLen = Math.floor(buffer.length / 2);
  const threshold = 0.15;
  let rms = 0;

  for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.006) return { freq: -1, clarity: 0, rms };

  const d = new Float32Array(halfLen);
  for (let tau = 0; tau < halfLen; tau++) {
    let sum = 0;
    for (let j = 0; j < halfLen; j++) {
      const delta = buffer[j] - buffer[j + tau];
      sum += delta * delta;
    }
    d[tau] = sum;
  }

  const dP = new Float32Array(halfLen);
  dP[0] = 1;
  let runSum = 0;
  for (let tau = 1; tau < halfLen; tau++) {
    runSum += d[tau];
    dP[tau] = runSum > 0 ? (d[tau] * tau) / runSum : 1;
  }

  const minTau = Math.floor(sampleRate / 1200);
  const maxTau = Math.floor(sampleRate / 60);
  let tau = Math.max(2, minTau);
  const stopTau = Math.min(maxTau, halfLen - 1);

  while (tau < stopTau) {
    if (dP[tau] < threshold) {
      while (tau + 1 < halfLen - 1 && dP[tau + 1] < dP[tau]) tau++;
      break;
    }
    tau++;
  }

  if (tau >= stopTau) return { freq: -1, clarity: 0, rms };

  let betterTau = tau;
  if (tau > 0 && tau < halfLen - 1) {
    const s0 = dP[tau - 1];
    const s1 = dP[tau];
    const s2 = dP[tau + 1];
    const denom = 2 * (s0 - 2 * s1 + s2);
    const shift = denom !== 0 ? (s0 - s2) / denom : 0;
    if (Math.abs(shift) < 1) betterTau = tau + shift;
  }

  return { freq: sampleRate / betterTau, clarity: 1 - dP[tau], rms };
}

function freqToNote(freq) {
  if (freq < 55 || freq > 1200) return null;
  const semitones = 12 * Math.log2(freq / A4);
  const rounded = Math.round(semitones);
  const idx = ((rounded % 12) + 12) % 12;
  return {
    name: NOTE_NAMES[idx],
    octave: Math.floor((rounded + 57) / 12),
    cents: (semitones - rounded) * 100,
    freq,
  };
}

function scoreChord(recentNotes, chord) {
  if (!chord || !CHORD_LIB[chord] || recentNotes.length === 0) return 0;
  const target = CHORD_LIB[chord].n;
  const detected = [...new Set(recentNotes.map((n) => n.name))];
  let hits = 0;
  for (const t of target) if (detected.includes(t)) hits++;
  return hits / target.length;
}

// ═══════════════════════════════════════════════════════════════════════
// HARMONIC AUDIO FEEDBACK ENGINE
// Family reactions feed the sensory experience through soft chimes and bloom pulses.
// ═══════════════════════════════════════════════════════════════════════
class HarmonicPad {
  constructor() {
    this.ctx = null;
    this.oscNodes = [];
    this.gainNode = null;
    this.filterNode = null;
    this.masterGain = null;
    this.currentChord = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.value = 600;
    this.filterNode.Q.value = 0.7;
    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  setChord(chordKey) {
    if (!this.ctx || chordKey === this.currentChord) return;
    this.currentChord = chordKey;
    this.oscNodes.forEach((o) => {
      try { o.osc.stop(); } catch (e) {}
    });
    this.oscNodes = [];
    if (!chordKey || !CHORD_LIB[chordKey]) return;

    const notes = CHORD_LIB[chordKey].n;
    notes.forEach((noteName) => {
      const noteIdx = NOTE_NAMES.indexOf(noteName);
      const freq = A4 * Math.pow(2, (noteIdx - 9 + (3 - 4) * 12) / 12);

      const osc1 = this.ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = freq;
      const g1 = this.ctx.createGain();
      g1.gain.value = 0.12;
      osc1.connect(g1);
      g1.connect(this.filterNode);
      osc1.start();
      this.oscNodes.push({ osc: osc1, gain: g1 });

      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2.003;
      const g2 = this.ctx.createGain();
      g2.gain.value = 0.06;
      osc2.connect(g2);
      g2.connect(this.filterNode);
      osc2.start();
      this.oscNodes.push({ osc: osc2, gain: g2 });
    });
  }

  setProximity(p) {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.setTargetAtTime(Math.pow(Math.max(0, p), 2) * 0.35, this.ctx.currentTime, 0.15);
    this.filterNode.frequency.setTargetAtTime(400 + p * 1200, this.ctx.currentTime, 0.2);
  }

  playSuccess() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 880;
    const g = this.ctx.createGain();
    g.gain.value = 0.15;
    g.gain.setTargetAtTime(0, this.ctx.currentTime + 0.1, 0.2);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  playFamilyReaction(kind = "spark") {
    if (!this.ctx) return;
    const map = {
      spark: [660, 990],
      applause: [523.25, 659.25, 783.99],
      love: [392, 523.25, 659.25],
    };
    const freqs = map[kind] || map.spark;
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = kind === "love" ? "sine" : "triangle";
      osc.frequency.value = freq;
      const g = this.ctx.createGain();
      g.gain.value = 0.055;
      g.gain.setTargetAtTime(0, now + 0.12 + idx * 0.035, 0.16);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now + idx * 0.035);
      osc.stop(now + 0.5 + idx * 0.05);
    });
  }

  stop() {
    this.oscNodes.forEach((o) => {
      try { o.osc.stop(); } catch (e) {}
    });
    this.oscNodes = [];
    if (this.masterGain) this.masterGain.gain.value = 0;
    this.currentChord = null;
  }

  destroy() {
    this.stop();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// BLE THERMAL BAND CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
const BLE_SERVICE_UUID = "0000aaaa-0000-1000-8000-00805f9b34fb";
const BLE_CONSONANCE_UUID = "0000aaa1-0000-1000-8000-00805f9b34fb";
const BLE_MODE_UUID = "0000aaa2-0000-1000-8000-00805f9b34fb";
const BLE_STATE_UUID = "0000aaa3-0000-1000-8000-00805f9b34fb";
const BLE_SUCCESS_UUID = "0000aaa4-0000-1000-8000-00805f9b34fb";

class ThermalBand {
  constructor() {
    this.device = null;
    this.consonanceChar = null;
    this.modeChar = null;
    this.stateChar = null;
    this.successChar = null;
    this.connected = false;
    this.onStateUpdate = null;
    this.lastState = null;
  }

  async connect() {
    if (!navigator.bluetooth) throw new Error("Web Bluetooth not available");
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Resonance" }],
      optionalServices: [BLE_SERVICE_UUID],
    });
    const server = await this.device.gatt.connect();
    const service = await server.getPrimaryService(BLE_SERVICE_UUID);
    this.consonanceChar = await service.getCharacteristic(BLE_CONSONANCE_UUID);
    this.modeChar = await service.getCharacteristic(BLE_MODE_UUID);
    this.stateChar = await service.getCharacteristic(BLE_STATE_UUID);
    this.successChar = await service.getCharacteristic(BLE_SUCCESS_UUID);

    await this.stateChar.startNotifications();
    this.stateChar.addEventListener("characteristicvaluechanged", (e) => {
      const dv = e.target.value;
      if (dv.byteLength >= 6) {
        this.lastState = {
          temp: dv.getFloat32(0, true),
          battery: dv.getUint8(4),
          status: dv.getUint8(5),
        };
        if (this.onStateUpdate) this.onStateUpdate(this.lastState);
      }
    });

    this.connected = true;
    this.device.addEventListener("gattserverdisconnected", () => {
      this.connected = false;
    });
  }

  async setMode(mode) {
    if (!this.connected || !this.modeChar) return;
    try { await this.modeChar.writeValue(new Uint8Array([mode])); } catch (e) { console.warn("BLE mode write error:", e); }
  }

  async sendConsonance(score) {
    if (!this.connected || !this.consonanceChar) return;
    try {
      const buf = new ArrayBuffer(4);
      new DataView(buf).setFloat32(0, score, true);
      await this.consonanceChar.writeValue(buf);
    } catch (e) {}
  }

  async sendSuccess() {
    if (!this.connected || !this.successChar) return;
    try { await this.successChar.writeValue(new Uint8Array([1])); } catch (e) {}
  }

  disconnect() {
    if (this.device?.gatt?.connected) this.device.gatt.disconnect();
    this.connected = false;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// FAMILY / REMOTE CHANNEL
// Shared storage channel. For real cross-device deployment, replace internals with
// Cloudflare Durable Object, Supabase Realtime, Firebase, or WebRTC signaling.
// Interface stays stable.
// ═══════════════════════════════════════════════════════════════════════
const ROOM_PREFIX = "resonance-room:";
const RELAY_BASE = (() => {
  try {
    return (import.meta?.env?.VITE_RELAY_URL || "").replace(/\/$/, "");
  } catch {
    return "";
  }
})();

class RemoteDuoChannel {
  constructor(roomCode, role, displayName = "") {
    this.roomCode = String(roomCode || "").trim().toUpperCase();
    this.role = role; // "lead" | "patient" | "family"
    this.displayName = displayName || role;
    this.participantId = `${role}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 6)}`;
    this.pollInterval = null;
    this.onChordReceived = null;
    this.onPeerJoined = null;
    this.onLiveState = null;
    this.onReaction = null;
    this.onRelayStatus = null;
    this.active = false;
    this.lastChordTs = 0;
    this.lastLiveTs = 0;
    this.lastReactionTs = 0;
    this.remoteAvailable = null; // null unknown, true remote relay, false local fallback
  }

  async join() {
    await this._upsertPresence(true);
    this.active = true;

    this.pollInterval = setInterval(async () => {
      if (!this.active) return;
      await this._upsertPresence(true);

      const presence = await this._get("presence") || {};
      const now = Date.now();
      const activePeople = Object.values(presence).filter((p) => p.active && now - p.joined < 12000);
      if (this.onPeerJoined) this.onPeerJoined(activePeople);

      if (this.role === "patient") {
        const chordData = await this._get("chord");
        if (chordData && chordData.ts > this.lastChordTs) {
          this.lastChordTs = chordData.ts;
          if (this.onChordReceived) this.onChordReceived(chordData.chord, chordData.ts);
        }

        const reaction = await this._get("reaction");
        if (reaction && reaction.ts > this.lastReactionTs) {
          this.lastReactionTs = reaction.ts;
          if (this.onReaction) this.onReaction(reaction);
        }
      }

      if (this.role === "family") {
        const live = await this._get("live");
        if (live && live.ts > this.lastLiveTs) {
          this.lastLiveTs = live.ts;
          if (this.onLiveState) this.onLiveState(live);
        }
      }
    }, 500);
  }

  async sendChord(chord) {
    if (this.role !== "lead") return;
    await this._set("chord", { chord, ts: Date.now() });
  }

  async sendLiveState(state) {
    if (this.role !== "patient") return;
    await this._set("live", { ...state, ts: Date.now() });
  }

  async sendReaction(kind) {
    if (this.role !== "family") return;
    await this._set("reaction", {
      id: Date.now().toString(36),
      kind,
      from: this.displayName || "Family",
      ts: Date.now(),
    });
  }

  async leave() {
    this.active = false;
    if (this.pollInterval) clearInterval(this.pollInterval);
    await this._upsertPresence(false);
  }

  async _upsertPresence(active) {
    const participant = {
      id: this.participantId,
      role: this.role,
      name: this.displayName,
      joined: active ? Date.now() : 0,
      active,
    };

    // Remote relay merges presence server-side. Local fallback merges client-side.
    const remoteOk = await this._remoteSet("presence", participant);
    if (remoteOk) return;

    const key = `${ROOM_PREFIX}${this.roomCode}:presence`;
    const presence = await storageGet(key, true) || {};
    presence[this.participantId] = participant;
    await storageSet(key, presence, true);
  }

  _url(kind) {
    return `${RELAY_BASE}/api/room/${encodeURIComponent(this.roomCode)}/${encodeURIComponent(kind)}`;
  }

  _localKey(kind) {
    return `${ROOM_PREFIX}${this.roomCode}:${kind}`;
  }

  async _set(kind, data) {
    const remoteOk = await this._remoteSet(kind, data);
    if (remoteOk) return;
    await storageSet(this._localKey(kind), data, true);
  }

  async _get(kind) {
    const remote = await this._remoteGet(kind);
    if (remote !== undefined) return remote;
    return await storageGet(this._localKey(kind), true);
  }

  async _remoteSet(kind, data) {
    if (this.remoteAvailable === false || typeof fetch === "undefined") return false;
    try {
      const res = await fetch(this._url(kind), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`relay ${res.status}`);
      this.remoteAvailable = true;
      if (this.onRelayStatus) this.onRelayStatus("cloudflare");
      return true;
    } catch (e) {
      this.remoteAvailable = false;
      if (this.onRelayStatus) this.onRelayStatus("local");
      return false;
    }
  }

  async _remoteGet(kind) {
    if (this.remoteAvailable === false || typeof fetch === "undefined") return undefined;
    try {
      const res = await fetch(this._url(kind), { method: "GET", cache: "no-store" });
      if (!res.ok) throw new Error(`relay ${res.status}`);
      this.remoteAvailable = true;
      if (this.onRelayStatus) this.onRelayStatus("cloudflare");
      const payload = await res.json();
      return payload?.data ?? null;
    } catch (e) {
      this.remoteAvailable = false;
      if (this.onRelayStatus) this.onRelayStatus("local");
      return undefined;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// LOCAL STORAGE KEYS
// ═══════════════════════════════════════════════════════════════════════
const SK = {
  profiles: "resonance:profiles",
  sessions: (pid) => `resonance:sessions:${pid}`,
  chordStats: (pid) => `resonance:chordstats:${pid}`,
  settings: (pid) => `resonance:settings:${pid}`,
  favorites: (pid) => `resonance:favorites:${pid}`,
};

// ═══════════════════════════════════════════════════════════════════════
// BLOOM VISUALIZATION
// Family feedback appears as a warm aura that joins the chord glow.
// ═══════════════════════════════════════════════════════════════════════
function Bloom({ proximity, rms, detectedNotes, targetChord, isListening, isDuo, familyPulse, familyReaction }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const st = useRef({ p: 0, rms: 0, fp: 0, particles: [], t: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const s = st.current;
      s.p += (proximity - s.p) * 0.06;
      s.rms += (rms - s.rms) * 0.1;
      s.fp += (familyPulse - s.fp) * 0.08;
      s.t += 0.016;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const p = Math.max(0, Math.min(1, s.p));
      const fp = Math.max(0, Math.min(1, s.fp));
      const baseR = Math.min(w, h) * 0.14;
      const maxR = Math.min(w, h) * 0.36;
      const radius = baseR + (maxR - baseR) * p;

      for (let i = 4; i >= 0; i--) {
        const gr = radius + i * 24 * (0.3 + p * 0.7) + fp * 16;
        const a = (0.02 + p * 0.07 + fp * 0.045) * (1 - i * 0.18);
        const hue = isDuo
          ? `180,${140 + Math.floor(p * 50)},${80 + Math.floor(p * 40)}`
          : `${200 + Math.floor(p * 55)},${120 + Math.floor(p * 60)},${40 + Math.floor(p * 20)}`;
        const grad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, gr);
        grad.addColorStop(0, `rgba(${hue},${a})`);
        grad.addColorStop(1, `rgba(${hue},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, gr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Family aura: a second halo, never judgmental, just presence.
      if (fp > 0.02) {
        const glowR = radius * (1.35 + Math.sin(s.t * 2.2) * 0.04 + fp * 0.18);
        const grad = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, glowR);
        const reactionColor = familyReaction?.kind === "love" ? "255,120,150" : familyReaction?.kind === "applause" ? "255,210,120" : "190,220,255";
        grad.addColorStop(0, `rgba(${reactionColor},${0.06 * fp})`);
        grad.addColorStop(0.7, `rgba(${reactionColor},${0.12 * fp})`);
        grad.addColorStop(1, `rgba(${reactionColor},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        for (let i = 0; i < 8 + Math.floor(fp * 8); i++) {
          const a = (i / 12) * Math.PI * 2 + s.t * (0.4 + fp * 0.3);
          const px = cx + Math.cos(a) * glowR * (0.72 + Math.sin(s.t + i) * 0.03);
          const py = cy + Math.sin(a) * glowR * (0.72 + Math.cos(s.t + i) * 0.03);
          ctx.beginPath();
          ctx.arc(px, py, 1.3 + fp * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${reactionColor},${0.18 * fp})`;
          ctx.fill();
        }
      }

      if (p > 0.15) {
        const n = 6 + Math.floor(p * 6);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + s.t * 0.3;
          const len = radius * (0.4 + p * 0.8) * (0.8 + Math.sin(s.t * 2 + i) * 0.2);
          const px = cx + Math.cos(a) * len;
          const py = cy + Math.sin(a) * len;
          const wh = isDuo ? "160,210,180" : "255,200,100";
          const g = ctx.createRadialGradient(px, py, 0, px, py, len * 0.35);
          g.addColorStop(0, `rgba(${wh},${0.08 + p * 0.14})`);
          g.addColorStop(1, `rgba(${wh},0)`);
          ctx.beginPath();
          ctx.arc(px, py, len * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      }

      const breathe = Math.sin(s.t * 1.2) * 0.03;
      const coreR = radius * (1 + breathe) + s.rms * 35 + fp * 7;
      const cg = ctx.createRadialGradient(cx - coreR * 0.2, cy - coreR * 0.2, coreR * 0.1, cx, cy, coreR);
      const it = 0.3 + p * 0.7 + fp * 0.15;
      if (isDuo) {
        cg.addColorStop(0, `rgba(${160 + Math.floor(p * 60)},${220 + Math.floor(p * 35)},${190 + Math.floor(p * 40)},${it})`);
        cg.addColorStop(0.6, `rgba(${100 + Math.floor(p * 40)},${170 + Math.floor(p * 40)},${140 + Math.floor(p * 30)},${it * 0.7})`);
        cg.addColorStop(1, `rgba(80,120,100,${it * 0.3})`);
      } else {
        cg.addColorStop(0, `rgba(255,${210 + Math.floor(p * 45)},${140 + Math.floor(p * 60)},${it})`);
        cg.addColorStop(0.6, `rgba(${210 + Math.floor(p * 45)},${140 + Math.floor(p * 40)},${60 + Math.floor(p * 30)},${it * 0.7})`);
        cg.addColorStop(1, `rgba(${160 + Math.floor(p * 40)},${80 + Math.floor(p * 30)},30,${it * 0.3})`);
      }
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      if (p > 0.85) {
        const ra = (p - 0.85) / 0.15;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 1.15 + Math.sin(s.t * 3) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,235,180,${ra * 0.6})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const spawnRate = s.rms * 3 + p * 0.5 + fp * 0.35;
      if (s.rms > 0.01 && Math.random() < spawnRate) {
        const a = Math.random() * Math.PI * 2;
        s.particles.push({
          x: cx + Math.cos(a) * coreR * 0.8,
          y: cy + Math.sin(a) * coreR * 0.8,
          vx: Math.cos(a) * (0.5 + p * 1.5 + fp),
          vy: Math.sin(a) * (0.5 + p * 1.5 + fp) - 0.5,
          life: 1,
          size: 1 + Math.random() * 2 + p * 2 + fp,
          family: fp > 0.15 && Math.random() < 0.45,
        });
      }

      s.particles = s.particles.filter((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy -= 0.02;
        pt.life -= 0.015;
        if (pt.life <= 0) return false;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * pt.life, 0, Math.PI * 2);
        ctx.fillStyle = pt.family
          ? `rgba(255,230,180,${pt.life * 0.45})`
          : `rgba(255,${200 + Math.floor(p * 55)},${120 + Math.floor(p * 80)},${pt.life * 0.5})`;
        ctx.fill();
        return true;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [proximity, rms, detectedNotes, targetChord, isListening, isDuo, familyPulse, familyReaction]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ═══════════════════════════════════════════════════════════════════════
// THERMAL BAND STATUS WIDGET
// ═══════════════════════════════════════════════════════════════════════
function BandStatus({ bandState, connected }) {
  if (!connected) return null;
  const st = bandState || { temp: 31, battery: 100, status: 0 };
  const statusLabels = ["Idle", "Active", "Safety Stop", "Low Batt"];
  const tempColor = st.temp < 29 ? "#6AACBE" : st.temp < 33 ? "#A09880" : st.temp < 36 ? "#C8A060" : "#D4784A";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", fontSize: 11 }}>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: st.status === 1 ? "#6B8E6B" : st.status === 2 ? "#D44" : "#A09880" }} />
      <span style={{ color: tempColor, fontWeight: 600, fontFamily: "monospace" }}>{Number(st.temp).toFixed(1)}°C</span>
      <span style={{ color: "#6a5e52" }}>|</span>
      <span style={{ color: "#8a7a6a" }}>{st.battery}%</span>
      <span style={{ color: "#6a5e52" }}>|</span>
      <span style={{ color: "#8a7a6a" }}>{statusLabels[st.status] || "?"}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════════
export default function ResonanceV3Family() {
  // ─── Core State ──────────────────────────────────────────────────
  const [view, setView] = useState("home");
  const [profileId, setProfileId] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [playMode, setPlayMode] = useState("solo"); // solo | duo-local | duo-remote-lead | duo-remote-patient | family-join
  const [selectedSong, setSelectedSong] = useState(null);
  const [sensitivity, setSensitivity] = useState(0.4);
  const [customChords, setCustomChords] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Play
  const [isListening, setIsListening] = useState(false);
  const [detectedNotes, setDetectedNotes] = useState([]);
  const [proximity, setProximity] = useState(0);
  const [rms, setRms] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [holdTimer, setHoldTimer] = useState(0);
  const [sessionLog, setSessionLog] = useState([]);
  const [sessionStart, setSessionStart] = useState(null);

  // Duo / family
  const [leadChord, setLeadChord] = useState(null);
  const [harmonyChord, setHarmonyChord] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [peerConnected, setPeerConnected] = useState(false);
  const [lastRemoteChordTs, setLastRemoteChordTs] = useState(0);
  const [relayStatus, setRelayStatus] = useState("unknown");
  const [familyName, setFamilyName] = useState("");
  const [familyLiveState, setFamilyLiveState] = useState(null);
  const [familyReaction, setFamilyReaction] = useState(null);
  const [familyPulse, setFamilyPulse] = useState(0);
  const [reactionLog, setReactionLog] = useState([]);

  // Dashboard
  const [sessions, setSessions] = useState([]);
  const [chordStats, setChordStats] = useState({});
  const [chordThresholds, setChordThresholds] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [favoriteTitle, setFavoriteTitle] = useState("");
  const [favoriteNote, setFavoriteNote] = useState("");

  // BLE Thermal Band
  const [bandConnected, setBandConnected] = useState(false);
  const [bandState, setBandState] = useState(null);
  const [bandEnabled, setBandEnabled] = useState(false);

  // Refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const holdRef = useRef(0);
  const padRef = useRef(null);
  const bandRef = useRef(null);
  const duoChannelRef = useRef(null);

  const isFamilyJoin = playMode === "family-join";
  const isDuoMode = playMode.startsWith("duo");
  const isRemoteDuo = playMode.startsWith("duo-remote");
  const isLeadRole = playMode === "duo-remote-lead";
  const isPatientRole = playMode === "duo-remote-patient" || playMode === "duo-local";
  const canHostFamilyRoom = !isLeadRole && !isFamilyJoin;

  const currentChords = useMemo(() => {
    if (isDuoMode && harmonyChord) return [harmonyChord];
    return selectedSong ? (SONGS.find((s) => s.name === selectedSong)?.chords || []) : customChords;
  }, [selectedSong, customChords, isDuoMode, harmonyChord]);

  const targetChord = currentChords[currentIdx] || null;
  const baseThreshold = 0.5 + sensitivity * 0.35;
  const adaptiveThreshold = targetChord ? (chordThresholds[targetChord] ?? baseThreshold) : baseThreshold;
  const holdRequired = 1.2;

  // ─── Storage ─────────────────────────────────────────────────────
  useEffect(() => { load(SK.profiles, []).then(setProfiles); }, []);

  useEffect(() => {
    if (!profileId) return;
    load(SK.sessions(profileId), []).then(setSessions);
    load(SK.chordStats(profileId), {}).then(setChordStats);
    load(SK.favorites(profileId), []).then(setFavorites);
    load(SK.settings(profileId), { sensitivity: 0.4, audioFeedback: true }).then((s) => {
      setSensitivity(s.sensitivity ?? 0.4);
      setAudioFeedback(s.audioFeedback ?? true);
    });
  }, [profileId]);

  const saveSession = useCallback(async (log) => {
    if (!profileId || log.length === 0) return;
    const session = {
      id: Date.now().toString(36),
      date: new Date().toISOString(),
      song: selectedSong || "Custom",
      mode: playMode,
      chords: log,
      count: log.length,
      reactions: reactionLog,
      duration: sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0,
      bandUsed: bandConnected,
      familyRoom: roomCode || null,
    };

    const updated = [...sessions, session].slice(-200);
    setSessions(updated);
    await save(SK.sessions(profileId), updated);

    const stats = { ...chordStats };
    for (const entry of log) {
      if (!stats[entry.chord]) stats[entry.chord] = { attempts: 0, successes: 0, totalScore: 0 };
      stats[entry.chord].attempts++;
      stats[entry.chord].successes++;
      stats[entry.chord].totalScore += parseFloat(entry.score);
    }
    setChordStats(stats);
    await save(SK.chordStats(profileId), stats);

    const thresholds = { ...chordThresholds };
    for (const [chord, stat] of Object.entries(stats)) {
      const rate = stat.successes / Math.max(stat.attempts, 1);
      if (rate > 0.8 && stat.attempts > 5) thresholds[chord] = Math.min(baseThreshold + 0.15, (thresholds[chord] ?? baseThreshold) + 0.02);
      else if (rate < 0.3 && stat.attempts > 3) thresholds[chord] = Math.max(0.3, (thresholds[chord] ?? baseThreshold) - 0.03);
    }
    setChordThresholds(thresholds);
  }, [profileId, selectedSong, playMode, reactionLog, sessionStart, bandConnected, roomCode, sessions, chordStats, chordThresholds, baseThreshold]);

  const saveFavoritePerformance = useCallback(async () => {
    if (!profileId || sessionLog.length === 0) return;
    const fav = {
      id: Date.now().toString(36),
      date: new Date().toISOString(),
      title: favoriteTitle.trim() || `${selectedSong || "Custom"} — ${new Date().toLocaleDateString()}`,
      note: favoriteNote.trim(),
      song: selectedSong || "Custom",
      mode: playMode,
      chords: sessionLog,
      reactions: reactionLog,
      chordCount: sessionLog.length,
      successCount,
      duration: sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0,
      peakScore: Math.max(...sessionLog.map((e) => parseFloat(e.score || 0))),
      familyRoom: roomCode || null,
    };

    const updated = [fav, ...favorites].slice(0, 50);
    setFavorites(updated);
    await save(SK.favorites(profileId), updated);
    setFavoriteTitle("");
    setFavoriteNote("");
  }, [profileId, sessionLog, favoriteTitle, favoriteNote, selectedSong, playMode, reactionLog, successCount, sessionStart, roomCode, favorites]);

  // ─── BLE Thermal Band ────────────────────────────────────────────
  const connectBand = useCallback(async () => {
    try {
      const band = new ThermalBand();
      band.onStateUpdate = (st) => setBandState(st);
      await band.connect();
      await band.setMode(2); // thermal + piezo
      bandRef.current = band;
      setBandConnected(true);
    } catch (err) {
      console.warn("Band connection failed:", err.message);
      setBandConnected(false);
    }
  }, []);

  const disconnectBand = useCallback(() => {
    if (bandRef.current) {
      bandRef.current.setMode(0);
      bandRef.current.disconnect();
    }
    setBandConnected(false);
    setBandState(null);
  }, []);

  // ─── Remote / Family Room ────────────────────────────────────────
  const joinRoom = useCallback(async (role) => {
    if (!roomCode.trim()) return;
    const displayName = role === "family"
      ? familyName.trim() || "Family"
      : profiles.find((p) => p.id === profileId)?.name || role;

    const ch = new RemoteDuoChannel(roomCode.trim().toUpperCase(), role, displayName);

    ch.onPeerJoined = (people) => {
      setPeerConnected(people.some((p) => p.role !== role));
    };
    ch.onRelayStatus = setRelayStatus;

    if (role === "patient") {
      ch.onChordReceived = (chord, ts) => {
        setLastRemoteChordTs((prev) => {
          if (ts > prev) {
            setLeadChord(chord);
            return ts;
          }
          return prev;
        });
      };

      ch.onReaction = (reaction) => {
        setFamilyReaction(reaction);
        setReactionLog((log) => [...log, reaction].slice(-200));
        setFamilyPulse(1);
        setTimeout(() => setFamilyReaction(null), 3600);

        // Family feedback becomes sensory, not just text.
        if (padRef.current) padRef.current.playFamilyReaction(reaction.kind);
        if (navigator.vibrate) navigator.vibrate(reaction.kind === "love" ? [60, 40, 100] : 80);
        if (bandRef.current?.connected) {
          bandRef.current.sendConsonance(1.0);
          if (reaction.kind === "applause" || reaction.kind === "love") bandRef.current.sendSuccess();
        }
      };
    }

    if (role === "family") {
      ch.onLiveState = (live) => setFamilyLiveState(live);
    }

    await ch.join();
    duoChannelRef.current = ch;
  }, [roomCode, familyName, profileId, profiles]);

  const leaveRoom = useCallback(async () => {
    if (duoChannelRef.current) {
      await duoChannelRef.current.leave();
      duoChannelRef.current = null;
    }
    setPeerConnected(false);
  }, []);

  // Family pulse decay.
  useEffect(() => {
    if (familyPulse <= 0) return;
    const iv = setInterval(() => setFamilyPulse((p) => Math.max(0, p - 0.035)), 60);
    return () => clearInterval(iv);
  }, [familyPulse]);

  // ─── Audio Engine ────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      streamRef.current = stream;
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = actx;
      const source = actx.createMediaStreamSource(stream);
      const analyser = actx.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.85;
      source.connect(analyser);
      analyserRef.current = analyser;

      if (audioFeedback && !isLeadRole) {
        padRef.current = new HarmonicPad();
        padRef.current.init();
      }

      const buffer = new Float32Array(analyser.fftSize);
      const detect = () => {
        analyser.getFloatTimeDomainData(buffer);
        const result = yinDetect(buffer, actx.sampleRate);
        setRms(result.rms);
        if (result.freq > 0 && result.clarity > 0.6) {
          const note = freqToNote(result.freq);
          if (note) {
            setDetectedNotes((prev) => {
              const now = Date.now();
              return [...prev.filter((n) => now - n.ts < 900), { ...note, ts: now, clarity: result.clarity }].slice(-10);
            });
          }
        }
        rafRef.current = requestAnimationFrame(detect);
      };
      rafRef.current = requestAnimationFrame(detect);
      setIsListening(true);
      setSessionStart(Date.now());
    } catch (err) {
      console.error("Mic error:", err);
    }
  }, [audioFeedback, isLeadRole]);

  const stopListening = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
    if (padRef.current) {
      padRef.current.destroy();
      padRef.current = null;
    }
    setIsListening(false);
    setDetectedNotes([]);
    setRms(0);
  }, []);

  // ─── Lead Role: auto-detect chords from own playing ──────────────
  useEffect(() => {
    if (!isLeadRole || !isListening) return;
    const iv = setInterval(() => {
      setDetectedNotes((notes) => {
        let bestChord = null;
        let bestScore = 0;
        for (const key of Object.keys(CHORD_LIB)) {
          const s = scoreChord(notes, key);
          if (s > bestScore) {
            bestScore = s;
            bestChord = key;
          }
        }
        if (bestChord && bestScore >= 0.6 && bestChord !== leadChord) {
          setLeadChord(bestChord);
          if (duoChannelRef.current) duoChannelRef.current.sendChord(bestChord);
        }
        return notes;
      });
    }, 200);
    return () => clearInterval(iv);
  }, [isLeadRole, isListening, leadChord]);

  // ─── Scoring Loop (player/solo/patient) ──────────────────────────
  useEffect(() => {
    if (!isListening || !targetChord || isLeadRole || isFamilyJoin) return;
    if (padRef.current) padRef.current.setChord(targetChord);

    const iv = setInterval(() => {
      setDetectedNotes((notes) => {
        const rawScore = scoreChord(notes, targetChord);
        const sensoryScore = Math.min(1, rawScore + familyPulse * 0.08); // family presence adds warmth, not false scoring domination.
        setProximity((prev) => prev + (sensoryScore - prev) * 0.12);
        if (padRef.current) padRef.current.setProximity(sensoryScore);
        if (bandRef.current?.connected) bandRef.current.sendConsonance(sensoryScore);

        if (rawScore >= adaptiveThreshold) {
          holdRef.current += 0.1;
          setHoldTimer(holdRef.current);
          if (holdRef.current >= holdRequired) {
            holdRef.current = 0;
            setHoldTimer(0);
            setSuccessCount((c) => c + 1);
            if (padRef.current) padRef.current.playSuccess();
            if (bandRef.current?.connected) bandRef.current.sendSuccess();
            if (navigator.vibrate) navigator.vibrate(200);
            setSessionLog((log) => [...log, { chord: targetChord, time: new Date().toLocaleTimeString(), score: rawScore.toFixed(2), ts: Date.now() }]);
            setCurrentIdx((idx) => {
              if (isDuoMode) return 0;
              const next = idx + 1;
              return next >= currentChords.length ? 0 : next;
            });
          }
        } else {
          holdRef.current = Math.max(0, holdRef.current - 0.05);
          setHoldTimer(holdRef.current);
        }
        return notes;
      });
    }, 100);

    return () => clearInterval(iv);
  }, [isListening, targetChord, adaptiveThreshold, currentChords.length, isDuoMode, isLeadRole, isFamilyJoin, familyPulse]);

  // ─── Duo: Compute harmony ────────────────────────────────────────
  useEffect(() => {
    if (!isDuoMode || !leadChord) return;
    const options = HARMONY_MAP[leadChord] || [];
    let best = options[0] || "G";
    if (chordStats && options.length > 1) {
      let bestRate = -1;
      for (const opt of options) {
        const s = chordStats[opt];
        const rate = s ? s.successes / Math.max(s.attempts, 1) : 0.5;
        if (rate > bestRate) {
          bestRate = rate;
          best = opt;
        }
      }
    }
    setHarmonyChord(best);
    setCurrentIdx(0);
  }, [leadChord, isDuoMode, chordStats]);

  // ─── Patient publishes live state for family room ────────────────
  useEffect(() => {
    if (!isListening || isLeadRole || isFamilyJoin) return;
    if (!duoChannelRef.current) return;
    const iv = setInterval(() => {
      duoChannelRef.current.sendLiveState({
        profileName: profiles.find((p) => p.id === profileId)?.name || "Player",
        song: selectedSong || "Custom Session",
        mode: playMode,
        targetChord,
        leadChord,
        harmonyChord,
        proximity,
        successCount,
        familyPulse,
        familyReaction,
        rms,
        listening: isListening,
        sessionStarted: sessionStart,
      });
    }, 500);
    return () => clearInterval(iv);
  }, [isListening, isLeadRole, isFamilyJoin, profileId, profiles, selectedSong, playMode, targetChord, leadChord, harmonyChord, proximity, successCount, familyPulse, familyReaction, rms, sessionStart]);

  // ─── Export ──────────────────────────────────────────────────────
  const exportData = useCallback(() => {
    const data = {
      export_version: "resonance_v3_family",
      export_date: new Date().toISOString(),
      device_classification: "General Wellness Product",
      disclaimer: "This product promotes wellness through musical engagement and family connection. It does not diagnose, treat, cure, or prevent any disease or condition.",
      thermal_band: { used: sessions.some((s) => s.bandUsed), hardware: "ESP32-S3 + Peltier, PID-controlled, safety bounded" },
      player_id: profileId,
      player_name: profiles.find((p) => p.id === profileId)?.name || "Unknown",
      sessions,
      favorites,
      chord_performance: chordStats,
      adaptive_thresholds: chordThresholds,
      total_sessions: sessions.length,
      total_chords_landed: sessions.reduce((a, s) => a + s.count, 0),
      total_engagement_minutes: Math.round(sessions.reduce((a, s) => a + (s.duration || 0), 0) / 60),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resonance_${profileId || "family"}_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [profileId, profiles, sessions, favorites, chordStats, chordThresholds]);

  const generateRoom = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setRoomCode(code);
  };

  const beginSession = useCallback(async () => {
    const canStart = isFamilyJoin || isDuoMode || selectedSong || customChords.length > 0;
    if (!canStart) return;

    setCurrentIdx(0);
    setSuccessCount(0);
    setSessionLog([]);
    setReactionLog([]);
    setFamilyPulse(0);
    setProximity(0);
    setLeadChord(null);
    setHarmonyChord(null);

    if (isFamilyJoin && roomCode.trim()) {
      await joinRoom("family");
    } else if (isRemoteDuo && roomCode.trim()) {
      await joinRoom(isLeadRole ? "lead" : "patient");
    } else if (canHostFamilyRoom && roomCode.trim()) {
      await joinRoom("patient");
    }

    setView("play");
  }, [isFamilyJoin, isDuoMode, selectedSong, customChords.length, roomCode, joinRoom, isRemoteDuo, isLeadRole, canHostFamilyRoom]);

  // ═══════════════════════════════════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════════════════════════════════
  if (view === "home") {
    return (
      <div style={S.page}>
        <div style={S.inner}>
          <div style={S.mark}>✦</div>
          <h1 style={S.title}>Resonance</h1>
          <p style={S.sub}>Family music room + sensory stage hand</p>

          <div style={S.section}>
            <label style={S.label}>Player Profiles</label>
            {profiles.map((p) => (
              <button key={p.id} style={S.profileBtn} onClick={() => { setProfileId(p.id); setPlayMode("solo"); setView("setup"); }}>
                <span style={{ fontSize: 17, fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontSize: 12, color: "#7a6a5a" }}>Last: {p.lastSession || "No sessions yet"}</span>
              </button>
            ))}
          </div>

          <div style={S.section}>
            <label style={S.label}>New Player</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={S.input} placeholder="First name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              <button style={S.smallBtn} onClick={async () => {
                if (!profileName.trim()) return;
                const id = Date.now().toString(36);
                const updated = [...profiles, { id, name: profileName.trim(), created: new Date().toISOString(), lastSession: null }];
                setProfiles(updated);
                await save(SK.profiles, updated);
                setProfileId(id);
                setProfileName("");
                setPlayMode("solo");
                setView("setup");
              }}>Create</button>
            </div>
          </div>

          <div style={S.section}>
            <label style={S.label}>Family Join-In</label>
            <div style={S.cBox}>
              <p style={{ ...S.hint, marginBottom: 10 }}>Join the room code from the caregiver. Your feedback becomes a gentle part of the player’s sensory experience.</p>
              <input style={{ ...S.input, marginBottom: 8, fontFamily: "monospace", fontSize: 20, letterSpacing: 4, textAlign: "center", textTransform: "uppercase" }} value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6} />
              <input style={{ ...S.input, marginBottom: 8 }} value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Your name, e.g. Mom, Brother, Christian" />
              <button style={S.startBtn} onClick={async () => { setPlayMode("family-join"); await beginSession(); }}>Join Family Room</button>
            </div>
          </div>

          <div style={{ ...S.section, marginTop: 32 }}>
            <div style={S.cBox}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#6a5e52", marginBottom: 6 }}>Performance-first general wellness</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, margin: 0, color: "#8a7e72" }}>
                Resonance promotes family connection through music. Non-invasive mic input, optional sensory band, and local-first session memories.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════════════════════════════
  if (view === "setup") {
    return (
      <div style={S.page}>
        <div style={S.inner}>
          <div style={S.headerRow}>
            <button style={S.backBtn} onClick={() => setView("home")}>← Profiles</button>
            <button style={S.backBtn} onClick={() => setView("dashboard")}>Dashboard →</button>
          </div>
          <h2 style={{ ...S.title, fontSize: 24 }}>{profiles.find((p) => p.id === profileId)?.name || "Session"}</h2>

          <div style={S.section}>
            <label style={S.label}>Mode</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { key: "solo", icon: "🎸", label: "Solo Practice", desc: "Player practices with adaptive guidance" },
                { key: "duo-local", icon: "🎸🎸", label: "Duo — Same Room", desc: "Caregiver taps lead chords while family plays along" },
                { key: "duo-remote-patient", icon: "🌐 🎸", label: "Remote Duo — Player Side", desc: "Lead player sends chord changes from another place" },
                { key: "duo-remote-lead", icon: "🎸 🌐", label: "Remote Duo — Lead Side", desc: "Open this on the lead player’s phone" },
              ].map((m) => (
                <button key={m.key} style={{ ...S.modeBtn, ...(playMode === m.key ? S.modeBtnActive : {}) }} onClick={() => setPlayMode(m.key)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: "#7a6a5a", marginTop: 2 }}>{m.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {(isRemoteDuo || canHostFamilyRoom) && (
            <div style={S.section}>
              <label style={S.label}>{canHostFamilyRoom ? "Family Room" : "Room Code"}</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input style={{ ...S.input, fontFamily: "monospace", fontSize: 20, letterSpacing: 4, textAlign: "center", textTransform: "uppercase" }} value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6} />
                {(isLeadRole || canHostFamilyRoom) && <button style={S.smallBtn} onClick={generateRoom}>Generate</button>}
              </div>
              <p style={{ ...S.hint, marginTop: 8 }}>
                {isLeadRole
                  ? "Generate a code and share it with the player’s caregiver."
                  : canHostFamilyRoom
                    ? "Share this code with family. Their spark, applause, and love will become gentle sensory feedback in the session."
                    : "Enter the code the lead player shared."}
              </p>
            </div>
          )}

          {playMode === "solo" && (
            <>
              <div style={S.section}>
                <label style={S.label}>Familiar Song</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {SONGS.map((s) => (
                    <button key={s.name} style={{ ...S.songBtn, ...(selectedSong === s.name ? S.songBtnActive : {}) }} onClick={() => { setSelectedSong(s.name); setCustomChords([]); }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>{s.name}</span>
                      <span style={S.songChords}>{s.chords.join(" → ")}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={S.section}>
                <label style={S.label}>Or Custom Progression</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                  {customChords.map((c, i) => (
                    <span key={`${c}-${i}`} style={S.chordTag}>{c}<button onClick={() => setCustomChords((p) => p.filter((_, j) => j !== i))} style={S.chordX}>×</button></span>
                  ))}
                  <button onClick={() => setShowPicker(!showPicker)} style={S.addBtn}>+ Add</button>
                </div>
                {showPicker && (
                  <div style={S.picker}>
                    {Object.entries(CHORD_LIB).map(([k, v]) => (
                      <button key={k} style={S.pickBtn} onClick={() => { setCustomChords((p) => [...p, k]); setSelectedSong(null); setShowPicker(false); }}>{v.name}</button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div style={S.section}>
            <label style={S.label}>Sensitivity: {sensitivity < 0.3 ? "Gentle" : sensitivity < 0.6 ? "Moderate" : "Precise"}</label>
            <p style={S.hint}>{sensitivity < 0.3 ? "Accepts partial chords — best for early sessions" : sensitivity < 0.6 ? "Expects most chord tones" : "Requires clean voicing"}</p>
            <input type="range" min="0" max="1" step="0.05" value={sensitivity} onChange={(e) => {
              const next = parseFloat(e.target.value);
              setSensitivity(next);
              if (profileId) save(SK.settings(profileId), { sensitivity: next, audioFeedback });
            }} style={S.slider} />
          </div>

          <div style={S.section}>
            <label style={{ ...S.label, display: "flex", alignItems: "center", gap: 10 }}>
              Harmonic Audio Feedback
              <button onClick={() => { setAudioFeedback(!audioFeedback); if (profileId) save(SK.settings(profileId), { sensitivity, audioFeedback: !audioFeedback }); }} style={{ ...S.toggleBtn, background: audioFeedback ? "rgba(200,160,96,0.3)" : "rgba(255,255,255,0.05)" }}>{audioFeedback ? "ON" : "OFF"}</button>
            </label>
            <p style={S.hint}>Warm harmonic pad fades in as playing approaches target. Family feedback adds soft chimes.</p>
          </div>

          <div style={S.section}>
            <label style={{ ...S.label, display: "flex", alignItems: "center", gap: 10 }}>
              Thermal Band
              <button onClick={() => {
                if (bandConnected) { disconnectBand(); setBandEnabled(false); }
                else { setBandEnabled(true); connectBand(); }
              }} style={{ ...S.toggleBtn, background: bandConnected ? "rgba(100,180,140,0.3)" : bandEnabled ? "rgba(200,100,60,0.2)" : "rgba(255,255,255,0.05)" }}>
                {bandConnected ? "Connected" : bandEnabled ? "Searching..." : "Connect"}
              </button>
            </label>
            <p style={S.hint}>
              Optional sensory band. Family reactions can trigger a brief warmth/success pulse when connected.
              {typeof navigator !== "undefined" && !navigator.bluetooth && " Web Bluetooth is not available in this browser."}
            </p>
            {bandConnected && <BandStatus bandState={bandState} connected={bandConnected} />}
          </div>

          <button style={{ ...S.startBtn, opacity: (playMode === "solo" && !selectedSong && customChords.length === 0) ? 0.4 : 1 }} onClick={beginSession}>Begin Session</button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // PLAY
  // ═══════════════════════════════════════════════════════════════════
  if (view === "play") {
    const chordInfo = targetChord ? CHORD_LIB[targetChord] : null;
    const holdProgress = Math.min(holdTimer / holdRequired, 1);

    if (isFamilyJoin) {
      const live = familyLiveState;
      const p = live?.proximity || 0;
      const sendReaction = (kind) => {
        duoChannelRef.current?.sendReaction(kind);
        setFamilyPulse(1);
        setTimeout(() => setFamilyPulse(0.2), 600);
      };

      return (
        <div style={S.playPage}>
          <div style={S.playHeader}>
            <button style={S.backBtn} onClick={() => { leaveRoom(); setFamilyLiveState(null); setView("home"); }}>← Leave</button>
            <span style={S.badge}>Room {roomCode} · {relayStatus === "cloudflare" ? "live relay" : "local"}</span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#8a7a6a", marginBottom: 12 }}>Family Join-In</div>
            <div style={{ fontSize: 24, color: "#f0e4d4", marginBottom: 4 }}>{live?.profileName || "Waiting for player..."}</div>
            <div style={{ fontSize: 13, color: "#8a7a6a", fontStyle: "italic", marginBottom: 28 }}>{live?.song || "When the session starts, you will see the music here."}</div>

            <div style={{
              width: 220,
              height: 220,
              borderRadius: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `radial-gradient(circle, rgba(255,210,140,${0.08 + p * 0.35}) 0%, rgba(120,80,40,0.06) 55%, rgba(0,0,0,0) 70%)`,
              border: "1px solid rgba(255,220,180,0.08)",
              boxShadow: `0 0 ${20 + p * 70}px rgba(200,140,70,${0.08 + p * 0.25})`,
              marginBottom: 24,
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 64, fontWeight: 300, color: "#FFE0B0", letterSpacing: 4 }}>{live?.targetChord || "—"}</div>
                <div style={{ fontSize: 12, color: "rgba(255,220,180,0.35)", letterSpacing: 2, textTransform: "uppercase" }}>Target chord</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={S.statCard}><div style={S.statNum}>{live?.successCount || 0}</div><div style={S.statLabel}>Chords</div></div>
              <div style={S.statCard}><div style={S.statNum}>{Math.round(p * 100)}%</div><div style={S.statLabel}>Glow</div></div>
              <div style={S.statCard}><div style={S.statNum}>{live?.listening ? "Live" : "—"}</div><div style={S.statLabel}>Session</div></div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {[["spark", "✦ Spark"], ["applause", "👏 Applause"], ["love", "❤️ Love"]].map(([kind, label]) => (
                <button key={kind} style={S.smallBtn} onClick={() => sendReaction(kind)}>{label}</button>
              ))}
            </div>

            <p style={{ ...S.hint, marginTop: 20, textAlign: "center", maxWidth: 320 }}>Your feedback becomes a gentle glow, chime, vibration, or warmth pulse on the player side.</p>
          </div>
        </div>
      );
    }

    if (isLeadRole) {
      return (
        <div style={S.playPage}>
          <div style={S.playHeader}>
            <button style={S.backBtn} onClick={() => { stopListening(); leaveRoom(); setProximity(0); setView("setup"); }}>← End</button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: peerConnected ? "#6B8E6B" : "#8a7a6a" }} />
              <span style={{ fontSize: 12, color: peerConnected ? "#a0c8b0" : "#7a6a5a" }}>{peerConnected ? "Player connected" : "Waiting for player..."}</span>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#6a8a7a", marginBottom: 20 }}>Room: {roomCode}</div>
            <div style={{ fontSize: 80, fontWeight: 200, color: "#b0d8c0", letterSpacing: 6, marginBottom: 8, fontFamily: '"Newsreader", Georgia, serif' }}>{leadChord || "—"}</div>
            <div style={{ fontSize: 14, color: "#6a8a7a" }}>{leadChord ? CHORD_LIB[leadChord]?.name : "Play a chord — it will be detected"}</div>
          </div>

          <div style={{ padding: "16px", display: "flex", justifyContent: "center" }}>
            <button onClick={isListening ? stopListening : startListening} style={{ ...S.micBtn, background: isListening ? "linear-gradient(135deg,#2D5A40,#3D7A56)" : "linear-gradient(135deg,#2a2420,#3a3230)", boxShadow: isListening ? "0 0 30px rgba(60,140,80,0.3)" : "0 2px 8px rgba(0,0,0,0.3)" }}>
              <span style={{ fontSize: 26 }}>{isListening ? "🎸" : "🎤"}</span>
              <span style={{ fontSize: 13, letterSpacing: 1 }}>{isListening ? "Playing lead..." : "Tap to Start"}</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={S.playPage}>
        <div style={S.playHeader}>
          <button style={S.backBtn} onClick={() => {
            stopListening();
            saveSession(sessionLog);
            leaveRoom();
            if (bandRef.current) bandRef.current.setMode(0);
            const updated = profiles.map((p) => p.id === profileId ? { ...p, lastSession: new Date().toLocaleDateString() } : p);
            setProfiles(updated);
            save(SK.profiles, updated);
            setProximity(0);
            setView("setup");
          }}>← End</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {roomCode && <span style={{ ...S.badge, fontSize: 12 }}>Room {roomCode}</span>}
            {bandConnected && <BandStatus bandState={bandState} connected={bandConnected} />}
            <span style={S.badge}>✦ {successCount}</span>
          </div>
        </div>

        {familyReaction && (
          <div style={{ margin: "4px 16px 8px", padding: "10px 12px", borderRadius: 10, background: "rgba(255,210,140,0.08)", border: "1px solid rgba(255,210,140,0.16)", color: "#FFD89E", fontSize: 13, textAlign: "center" }}>
            {familyReaction.kind === "love" ? "❤️" : familyReaction.kind === "applause" ? "👏" : "✦"} {familyReaction.from || "Family"} is here with you
          </div>
        )}

        {isRemoteDuo && (
          <div style={{ padding: "6px 16px", display: "flex", alignItems: "center", gap: 8, background: "rgba(100,180,140,0.03)", borderBottom: "1px solid rgba(100,180,140,0.08)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: peerConnected ? "#6B8E6B" : "#8a7a6a" }} />
            <span style={{ fontSize: 12, color: peerConnected ? "#a0c8b0" : "#7a6a5a" }}>{peerConnected ? "Lead connected" : "Waiting for lead..."}</span>
            <span style={{ fontSize: 11, color: "#5a5e52", marginLeft: "auto" }}>Room: {roomCode}</span>
          </div>
        )}

        {playMode === "duo-local" && (
          <div style={S.duoBar}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#6a8a7a", marginBottom: 6 }}>Lead is playing:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.keys(CHORD_LIB).map((k) => (
                <button key={k} style={{ ...S.leadChordBtn, ...(leadChord === k ? S.leadChordActive : {}) }} onClick={() => setLeadChord(k)}>{k}</button>
              ))}
            </div>
            {harmonyChord && <div style={{ marginTop: 8, fontSize: 12, color: "#8aaa9a" }}>Harmony: <strong style={{ color: "#b0d8c0" }}>{harmonyChord}</strong> ({CHORD_LIB[harmonyChord]?.name})</div>}
          </div>
        )}

        {isRemoteDuo && leadChord && (
          <div style={{ padding: "8px 16px", background: "rgba(100,180,140,0.04)", borderBottom: "1px solid rgba(100,180,140,0.08)" }}>
            <span style={{ fontSize: 11, color: "#6a8a7a" }}>Lead: </span>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#b0d8c0" }}>{leadChord}</span>
            <span style={{ fontSize: 11, color: "#6a8a7a", marginLeft: 12 }}>→ Your target: </span>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#FFD89E" }}>{harmonyChord}</span>
          </div>
        )}

        <div style={S.bloomArea}>
          <Bloom proximity={proximity} rms={rms} detectedNotes={detectedNotes} targetChord={targetChord} isListening={isListening} isDuo={isDuoMode} familyPulse={familyPulse} familyReaction={familyReaction} />
          <div style={S.chordOverlay}>
            {targetChord && (
              <>
                <div style={{ ...S.bigChord, opacity: 0.6 + proximity * 0.4, transform: `scale(${1 + proximity * 0.12 + familyPulse * 0.03})` }}>{targetChord}</div>
                <div style={S.chordFull}>{chordInfo?.name}</div>
                <div style={S.noteRow}>
                  {chordInfo?.n.map((n, i) => {
                    const hit = detectedNotes.some((d) => d.name === n);
                    return <span key={`${n}-${i}`} style={{ ...S.noteInd, color: hit ? "#FFD89E" : "rgba(255,220,180,0.2)", textShadow: hit ? "0 0 12px rgba(255,200,100,0.6)" : "none" }}>{n}</span>;
                  })}
                </div>
              </>
            )}
          </div>
          {holdProgress > 0 && (
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", opacity: 0.8 }}>
              <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,220,160,0.12)" strokeWidth="2.5" />
              <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,210,130,0.7)" strokeWidth="2.5" strokeDasharray={`${holdProgress * 226} 226`} strokeLinecap="round" transform="rotate(-90 40 40)" />
            </svg>
          )}
        </div>

        {playMode === "solo" && currentChords.length > 1 && (
          <div style={{ padding: "0 16px 6px" }}>
            <div style={S.progressTrack}>
              {currentChords.map((c, i) => (
                <div key={`${c}-${i}`} style={{ flex: 1, padding: "8px 2px", textAlign: "center", transition: "all 0.3s", background: i < currentIdx ? "rgba(255,200,120,0.35)" : i === currentIdx ? "rgba(255,200,120,0.12)" : "rgba(255,255,255,0.03)", borderRight: i < currentChords.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ fontSize: 11, opacity: i === currentIdx ? 1 : 0.3, fontWeight: i === currentIdx ? 700 : 400 }}>{c}</span>
                </div>
              ))}
            </div>
            {selectedSong && <div style={{ fontSize: 11, color: "#5a5045", textAlign: "center", marginTop: 6, fontStyle: "italic" }}>{selectedSong}</div>}
          </div>
        )}

        <div style={{ padding: "12px 16px", display: "flex", justifyContent: "center" }}>
          <button onClick={isListening ? stopListening : startListening} style={{ ...S.micBtn, background: isListening ? "linear-gradient(135deg,#8B4513,#A0522D)" : "linear-gradient(135deg,#2a2420,#3a3230)", boxShadow: isListening ? "0 0 30px rgba(180,100,40,0.3)" : "0 2px 8px rgba(0,0,0,0.3)" }}>
            <span style={{ fontSize: 26 }}>{isListening ? "🎸" : "🎤"}</span>
            <span style={{ fontSize: 13, letterSpacing: 1 }}>{isListening ? "Listening..." : "Tap to Start"}</span>
          </button>
        </div>

        {sessionLog.length > 0 && (
          <div style={{ padding: "8px 16px 20px" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#5a5045", marginBottom: 6 }}>Session — {sessionLog.length} chord{sessionLog.length !== 1 ? "s" : ""} landed</div>
            {sessionLog.slice(-5).map((e, i) => (
              <div key={`${e.ts}-${i}`} style={S.logEntry}>
                <span style={{ color: "#c8a060", fontWeight: 600, minWidth: 36 }}>{e.chord}</span>
                <span style={{ color: "#5a5045", flex: 1, textAlign: "center", fontSize: 12 }}>{e.time}</span>
                <span style={{ color: "#7a6a5a", fontSize: 11, fontFamily: "monospace" }}>{Math.round(parseFloat(e.score) * 100)}%</span>
              </div>
            ))}
          </div>
        )}

        {sessionLog.length > 0 && (
          <div style={{ padding: "8px 16px 24px" }}>
            <div style={S.cBox}>
              <label style={S.label}>Save Favorite Performance</label>
              <input style={{ ...S.input, marginBottom: 8 }} value={favoriteTitle} onChange={(e) => setFavoriteTitle(e.target.value)} placeholder="Name this moment, e.g. Dad played Amazing Grace" />
              <input style={{ ...S.input, marginBottom: 8 }} value={favoriteNote} onChange={(e) => setFavoriteNote(e.target.value)} placeholder="Optional note, e.g. Everyone joined in" />
              <button style={S.smallBtn} onClick={saveFavoritePerformance}>★ Save Favorite</button>
              {reactionLog.length > 0 && <p style={{ ...S.hint, marginTop: 8 }}>{reactionLog.length} family reaction{reactionLog.length !== 1 ? "s" : ""} will be saved with this performance.</p>}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════════
  if (view === "dashboard") {
    const last14 = sessions.slice(-14).map((s) => ({
      day: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      chords: s.count,
      minutes: Math.round((s.duration || 0) / 60),
    }));
    const chordPerf = Object.entries(chordStats).map(([chord, stat]) => ({
      chord,
      rate: Math.round((stat.successes / Math.max(stat.attempts, 1)) * 100),
      attempts: stat.attempts,
    })).sort((a, b) => b.attempts - a.attempts);
    const totalChords = sessions.reduce((a, s) => a + s.count, 0);
    const totalMins = Math.round(sessions.reduce((a, s) => a + (s.duration || 0), 0) / 60);
    const bandSessions = sessions.filter((s) => s.bandUsed).length;

    return (
      <div style={S.page}>
        <div style={S.inner}>
          <div style={S.headerRow}>
            <button style={S.backBtn} onClick={() => setView("setup")}>← Setup</button>
            <button style={S.backBtn} onClick={() => setView("export")}>Export →</button>
          </div>
          <h2 style={{ ...S.title, fontSize: 22 }}>Dashboard</h2>
          <p style={S.sub}>{profiles.find((p) => p.id === profileId)?.name} — {sessions.length} sessions</p>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={S.statCard}><div style={S.statNum}>{sessions.length}</div><div style={S.statLabel}>Sessions</div></div>
            <div style={S.statCard}><div style={S.statNum}>{totalChords}</div><div style={S.statLabel}>Chords</div></div>
            <div style={S.statCard}><div style={S.statNum}>{totalMins}</div><div style={S.statLabel}>Minutes</div></div>
            {bandSessions > 0 && <div style={S.statCard}><div style={S.statNum}>{bandSessions}</div><div style={S.statLabel}>Band Sessions</div></div>}
          </div>

          {favorites.length > 0 && (
            <div style={S.section}>
              <label style={S.label}>Favorite Performances</label>
              {favorites.map((f) => (
                <div key={f.id} style={{ ...S.cBox, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#f0e4d4" }}>★ {f.title}</div>
                      <div style={{ fontSize: 11, color: "#7a6a5a", marginTop: 3 }}>{new Date(f.date).toLocaleString()} · {f.chordCount} chords · {Math.round((f.duration || 0) / 60)} min</div>
                    </div>
                    <div style={{ fontSize: 18, color: "#c8a060" }}>{Math.round((f.peakScore || 0) * 100)}%</div>
                  </div>
                  {f.note && <p style={{ fontSize: 12, color: "#9a8a78", lineHeight: 1.5, margin: "8px 0 0" }}>{f.note}</p>}
                  {f.reactions?.length > 0 && <p style={{ ...S.hint, marginTop: 8 }}>Family feedback: {f.reactions.length} reaction{f.reactions.length !== 1 ? "s" : ""}</p>}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                    {f.chords.slice(0, 12).map((c, i) => <span key={`${c.chord}-${i}`} style={S.chordTag}>{c.chord}</span>)}
                    {f.chords.length > 12 && <span style={S.hint}>+{f.chords.length - 12} more</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {last14.length > 0 && (
            <div style={S.section}>
              <label style={S.label}>Chords per Session</label>
              <div style={{ height: 160, margin: "0 -8px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last14} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6a5e52" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#6a5e52" }} />
                    <Tooltip contentStyle={{ background: "#1a1410", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#d8ccc0" }} />
                    <Bar dataKey="chords" fill="rgba(200,160,96,0.6)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {chordPerf.length > 0 && (
            <div style={S.section}>
              <label style={S.label}>Per-Chord Performance</label>
              {chordPerf.map((c) => (
                <div key={c.chord} style={S.chordStatRow}>
                  <span style={{ fontWeight: 600, color: "#c8a060", minWidth: 36 }}>{c.chord}</span>
                  <div style={S.chordBar}><div style={{ ...S.chordBarFill, width: `${c.rate}%` }} /></div>
                  <span style={{ fontSize: 12, color: "#8a7a6a", minWidth: 40, textAlign: "right" }}>{c.rate}%</span>
                  <span style={{ fontSize: 10, color: "#5a5045", minWidth: 30, textAlign: "right" }}>n={c.attempts}</span>
                </div>
              ))}
            </div>
          )}

          {sessions.length === 0 && favorites.length === 0 && <div style={{ ...S.cBox, textAlign: "center", padding: 30 }}><div style={{ fontSize: 32, marginBottom: 8 }}>🎸</div><p style={{ color: "#8a7e72", margin: 0 }}>No sessions yet.</p></div>}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════════════════════════════════
  if (view === "export") {
    return (
      <div style={S.page}>
        <div style={S.inner}>
          <button style={S.backBtn} onClick={() => setView("dashboard")}>← Dashboard</button>
          <h2 style={{ ...S.title, fontSize: 22, marginTop: 12 }}>Export & Compliance</h2>
          <div style={S.section}><button style={S.startBtn} onClick={exportData}>Download Session Data (JSON)</button></div>
          <div style={S.section}>
            <label style={S.label}>Family Connection Model</label>
            <div style={S.cBox}>
              <p style={{ color: "#8a7e72", lineHeight: 1.8, margin: 0, fontSize: 12 }}>
                Family Join-In lets trusted family members enter a room code, watch a live performance state, and send gentle encouragement. Feedback is converted into sensory output on the player side: bloom aura, harmonic chime, phone vibration, and optional thermal pulse. The family UI avoids clinical or failure language.
              </p>
            </div>
          </div>
          <div style={S.section}>
            <label style={S.label}>Device Classification</label>
            <div style={S.cBox}>
              <p style={{ color: "#a09888", lineHeight: 1.8, margin: "0 0 10px 0", fontSize: 13 }}><strong style={{ color: "#c8b098" }}>General Wellness Product</strong></p>
              {["Promotes wellness through musical engagement and social connection", "Non-invasive microphone input + optional sensory band", "No diagnostic, treatment, or disease-specific claims", "Session memories are local-first", "Room relay should use facility-approved infrastructure in production"].map((t, i) => (
                <p key={i} style={{ color: "#8a7e72", lineHeight: 1.7, margin: "0 0 6px 0", fontSize: 12 }}>✓ {t}</p>
              ))}
            </div>
          </div>
          <div style={S.section}>
            <label style={S.label}>Production Relay Note</label>
            <div style={S.cBox}>
              <p style={{ color: "#8a7e72", lineHeight: 1.8, margin: 0, fontSize: 12 }}>
                This component keeps the RemoteDuoChannel interface stable and uses window.storage/localStorage as a prototype relay. For real family devices across locations, replace only the channel internals with Cloudflare Durable Objects, Supabase Realtime, Firebase Realtime Database, or WebRTC signaling.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════
const S = {
  page: { minHeight: "100vh", background: "linear-gradient(160deg,#1a1410 0%,#0d0b09 40%,#12100e 100%)", color: "#e8ddd0", fontFamily: '"Newsreader", Georgia, serif', padding: "20px 16px 40px", overflowY: "auto" },
  inner: { maxWidth: 540, margin: "0 auto" },
  playPage: { minHeight: "100vh", background: "linear-gradient(160deg,#1a1410 0%,#0d0b09 40%,#12100e 100%)", color: "#e8ddd0", fontFamily: '"Newsreader", Georgia, serif', display: "flex", flexDirection: "column" },
  mark: { fontSize: 28, color: "#c8a060", marginBottom: 6, letterSpacing: 4 },
  title: { fontSize: 30, fontWeight: 300, letterSpacing: 2, margin: "0 0 4px 0", color: "#f0e4d4" },
  sub: { fontSize: 13, color: "#8a7a6a", margin: "0 0 24px 0", fontStyle: "italic", letterSpacing: 0.5 },
  section: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#9a8a78", display: "block", marginBottom: 8 },
  hint: { fontSize: 11, color: "#6a5e52", margin: "0 0 8px 0", fontStyle: "italic", lineHeight: 1.5 },
  headerRow: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  backBtn: { background: "none", border: "none", color: "#9a8a78", fontSize: 13, cursor: "pointer", fontFamily: '"Newsreader", Georgia, serif', padding: "6px 0" },
  profileBtn: { display: "flex", flexDirection: "column", gap: 4, width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "left", cursor: "pointer", color: "#d8ccc0", fontFamily: '"Newsreader", Georgia, serif', marginBottom: 6 },
  input: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: "#e8ddd0", fontSize: 15, fontFamily: '"Newsreader", Georgia, serif', outline: "none", width: "100%", boxSizing: "border-box" },
  smallBtn: { background: "rgba(200,160,96,0.2)", border: "1px solid rgba(200,160,96,0.3)", borderRadius: 8, padding: "10px 18px", color: "#d8c0a0", cursor: "pointer", fontFamily: '"Newsreader", Georgia, serif', fontSize: 13 },
  modeBtn: { width: "100%", display: "flex", alignItems: "center", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, cursor: "pointer", color: "#d8ccc0", fontFamily: '"Newsreader", Georgia, serif', textAlign: "left" },
  modeBtnActive: { background: "rgba(200,160,96,0.1)", borderColor: "rgba(200,160,96,0.3)" },
  songBtn: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px", textAlign: "left", cursor: "pointer", color: "#d8ccc0", fontFamily: '"Newsreader", Georgia, serif' },
  songBtnActive: { background: "rgba(200,160,96,0.1)", borderColor: "rgba(200,160,96,0.3)" },
  songChords: { fontSize: 11, color: "#7a6a5a", letterSpacing: 0.5, fontFamily: "monospace", marginTop: 3, display: "block" },
  chordTag: { background: "rgba(200,160,96,0.15)", border: "1px solid rgba(200,160,96,0.25)", borderRadius: 6, padding: "5px 10px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 },
  chordX: { background: "none", border: "none", color: "#a08060", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 },
  addBtn: { background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 6, padding: "5px 14px", color: "#8a7a6a", cursor: "pointer", fontSize: 12, fontFamily: '"Newsreader", Georgia, serif' },
  picker: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, padding: 10, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" },
  pickBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "7px 12px", color: "#d8ccc0", cursor: "pointer", fontSize: 12, fontFamily: '"Newsreader", Georgia, serif' },
  slider: { width: "100%", accentColor: "#c8a060" },
  toggleBtn: { border: "1px solid rgba(200,160,96,0.3)", borderRadius: 6, padding: "3px 10px", color: "#c8a060", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: 1, fontFamily: '"Newsreader", Georgia, serif' },
  startBtn: { width: "100%", padding: "15px", fontSize: 16, fontWeight: 500, letterSpacing: 1, background: "linear-gradient(135deg,#8B5E3C,#A0724B)", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontFamily: '"Newsreader", Georgia, serif', boxShadow: "0 4px 20px rgba(140,94,60,0.2)" },
  cBox: { padding: 14, background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" },
  playHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px" },
  badge: { fontSize: 16, color: "#c8a060", fontWeight: 600 },
  bloomArea: { flex: 1, minHeight: 260, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  chordOverlay: { position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none", zIndex: 2 },
  bigChord: { fontSize: 54, fontWeight: 300, color: "#FFE0B0", letterSpacing: 4, transition: "all 0.3s", fontFamily: '"Newsreader", Georgia, serif' },
  chordFull: { fontSize: 12, color: "rgba(255,220,180,0.35)", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 },
  noteRow: { display: "flex", gap: 18, marginTop: 12 },
  noteInd: { fontSize: 16, fontWeight: 600, letterSpacing: 1, transition: "all 0.2s", fontFamily: "monospace" },
  progressTrack: { display: "flex", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" },
  micBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 34px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.3s", color: "#e8ddd0", fontFamily: '"Newsreader", Georgia, serif' },
  logEntry: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 6, marginBottom: 3, fontSize: 13 },
  duoBar: { padding: "10px 16px", background: "rgba(100,180,140,0.04)", borderBottom: "1px solid rgba(100,180,140,0.1)" },
  leadChordBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "7px 13px", color: "#a0c8b0", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: '"Newsreader", Georgia, serif' },
  leadChordActive: { background: "rgba(100,180,140,0.2)", borderColor: "rgba(100,180,140,0.4)", color: "#c0f0d0" },
  statCard: { flex: 1, minWidth: 70, padding: "12px 8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, textAlign: "center" },
  statNum: { fontSize: 22, fontWeight: 300, color: "#c8a060" },
  statLabel: { fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: "#6a5e52", marginTop: 3 },
  chordStatRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  chordBar: { flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" },
  chordBarFill: { height: "100%", background: "linear-gradient(90deg,rgba(200,160,96,0.4),rgba(200,160,96,0.7))", borderRadius: 4, transition: "width 0.3s" },
};
