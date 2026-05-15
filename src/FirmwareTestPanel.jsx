import React, { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════
// BLE UUIDs — both services on ONE ESP32
// ═══════════════════════════════════════════════════════════════════════
const THERMAL_SERVICE = "0000aaaa-0000-1000-8000-00805f9b34fb";
const THERMAL_MODE = "0000aaa2-0000-1000-8000-00805f9b34fb";
const THERMAL_STATE = "0000aaa3-0000-1000-8000-00805f9b34fb";
const THERMAL_REACTION = "0000aaa5-0000-1000-8000-00805f9b34fb";

const STAGE_HAND_SERVICE = "0000bbbb-0000-1000-8000-00805f9b34fb";
const HAND_CONFIG = "0000bbb0-0000-1000-8000-00805f9b34fb";
const CHORD_TARGET = "0000bbb1-0000-1000-8000-00805f9b34fb";
const ASSIST_LEVEL = "0000bbb2-0000-1000-8000-00805f9b34fb";
const EMG_STATE = "0000bbb3-0000-1000-8000-00805f9b34fb";
const HAPTIC_EVENT = "0000bbb5-0000-1000-8000-00805f9b34fb";

// ═══════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════
const CHORDS = {
  G:  { id: 0, name: "G",  color: "#D4A043" },
  C:  { id: 1, name: "C",  color: "#C4784A" },
  D:  { id: 2, name: "D",  color: "#8B6E4E" },
  Em: { id: 3, name: "Em", color: "#6B8E6B" },
  Am: { id: 4, name: "Am", color: "#7B6B8E" },
};

const REACTIONS = {
  Spark:    { id: 1, intensity: 80,  duration: 10, icon: "⚡" },
  Applause: { id: 2, intensity: 100, duration: 20, icon: "👏" },
  Love:     { id: 3, intensity: 60,  duration: 50, icon: "❤️" },
  Success:  { id: 4, intensity: 100, duration: 15, icon: "✓" },
};

// ═══════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════
const S = {
  root: {
    fontFamily: "'Inter', 'SF Pro', system-ui, sans-serif",
    maxWidth: 520,
    margin: "0 auto",
    padding: "20px 16px",
    background: "linear-gradient(165deg, #0d0d0f 0%, #141418 50%, #0d0d0f 100%)",
    color: "#e8e0d6",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#D4A043",
    margin: "0 0 4px 0",
    letterSpacing: "0.5px",
  },
  subtitle: {
    fontSize: 12,
    color: "#6a5e52",
    margin: 0,
    fontFamily: "monospace",
  },
  connectBtn: (connected) => ({
    width: "100%",
    padding: "14px 16px",
    background: connected
      ? "linear-gradient(135deg, #1a3a1a, #2a4a2a)"
      : "linear-gradient(135deg, #1a1a1e, #252528)",
    color: connected ? "#7dbd7d" : "#aaa",
    border: `1px solid ${connected ? "#3a5a3a" : "#333"}`,
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s",
    marginBottom: 16,
    letterSpacing: "0.3px",
  }),
  section: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6a5e52",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    margin: "0 0 12px 0",
  },
  chordBtn: (color) => ({
    padding: "10px 0",
    flex: 1,
    background: `${color}18`,
    border: `1px solid ${color}44`,
    color: color,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 700,
    transition: "all 0.15s",
  }),
  rxBtn: {
    padding: "10px 0",
    flex: 1,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ccc",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.15s",
  },
  monitorGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  monitorCard: {
    padding: 14,
    background: "rgba(0,0,0,0.3)",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.04)",
  },
  monitorLabel: {
    fontSize: 10,
    color: "#5a5a5a",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: 4,
  },
  monitorValue: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "monospace",
    color: "#D4A043",
  },
  monitorSub: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
    fontFamily: "monospace",
  },
  killBtn: {
    width: "100%",
    padding: 16,
    background: "linear-gradient(135deg, #3a1a1a, #4a1a1a)",
    color: "#ff6b6b",
    border: "1px solid #5a2a2a",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: "1px",
    transition: "all 0.2s",
  },
  statusDot: (active) => ({
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: active ? "#6B8E6B" : "#444",
    marginRight: 8,
    boxShadow: active ? "0 0 6px #6B8E6B" : "none",
  }),
  log: {
    maxHeight: 100,
    overflowY: "auto",
    fontSize: 11,
    fontFamily: "monospace",
    color: "#555",
    padding: "8px 10px",
    background: "rgba(0,0,0,0.3)",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.03)",
  },
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function FirmwareTestPanel() {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chars, setChars] = useState({});
  const [thermalState, setThermalState] = useState({ temp_c: 0, battery_pct: 0, status: 0, fault_code: 0 });
  const [emgState, setEmgState] = useState({ effort_0_100: 0, quality: 0, flexor_rms: 0, extensor_rms: 0 });
  const [lastChord, setLastChord] = useState(null);
  const [lastReaction, setLastReaction] = useState(null);
  const [log, setLog] = useState([]);

  const addLog = useCallback((msg) => {
    const ts = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLog((prev) => [`${ts} ${msg}`, ...prev].slice(0, 50));
  }, []);

  // ─── Connect (single device, both services) ───────────────────────
  const connectGlove = async () => {
    if (!navigator.bluetooth) {
      alert("Web Bluetooth not available. Use Chrome on Android or desktop.");
      return;
    }
    try {
      addLog("Requesting BLE device…");
      const dev = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "Exodia" },
          { namePrefix: "StageHand" },
          { namePrefix: "Resonance" },
        ],
        optionalServices: [THERMAL_SERVICE, STAGE_HAND_SERVICE],
      });

      addLog(`Found: ${dev.name || "unnamed"}`);
      const server = await dev.gatt.connect();
      addLog("GATT connected");

      const c = {};

      // Thermal service
      try {
        const thermalSvc = await server.getPrimaryService(THERMAL_SERVICE);
        c.thermalMode = await thermalSvc.getCharacteristic(THERMAL_MODE);
        c.thermalState = await thermalSvc.getCharacteristic(THERMAL_STATE);
        c.thermalReaction = await thermalSvc.getCharacteristic(THERMAL_REACTION);

        await c.thermalState.startNotifications();
        c.thermalState.addEventListener("characteristicvaluechanged", (e) => {
          const dv = e.target.value;
          if (dv.byteLength >= 8) {
            setThermalState({
              temp_c: dv.getFloat32(1, true),
              battery_pct: dv.getUint8(5),
              status: dv.getUint8(6),
              fault_code: dv.getUint8(7),
            });
          }
        });
        addLog("Thermal service ready");
      } catch (e) {
        addLog(`Thermal service: ${e.message}`);
      }

      // Stage Hand service
      try {
        const handSvc = await server.getPrimaryService(STAGE_HAND_SERVICE);
        c.handConfig = await handSvc.getCharacteristic(HAND_CONFIG);
        c.chordTarget = await handSvc.getCharacteristic(CHORD_TARGET);
        c.assistLevel = await handSvc.getCharacteristic(ASSIST_LEVEL);
        c.emgState = await handSvc.getCharacteristic(EMG_STATE);
        c.hapticEvent = await handSvc.getCharacteristic(HAPTIC_EVENT);

        await c.emgState.startNotifications();
        c.emgState.addEventListener("characteristicvaluechanged", (e) => {
          const dv = e.target.value;
          if (dv.byteLength >= 14) {
            setEmgState({
              quality: dv.getUint8(2),
              effort_0_100: dv.getUint8(3),
              flexor_rms: dv.getFloat32(4, true),
              extensor_rms: dv.getFloat32(8, true),
            });
          }
        });
        addLog("Stage Hand service ready");
      } catch (e) {
        addLog(`Stage Hand service: ${e.message}`);
      }

      setChars(c);
      setDevice(dev);
      setConnected(true);
      addLog("✓ Glove connected — both services active");

      dev.addEventListener("gattserverdisconnected", () => {
        setConnected(false);
        setDevice(null);
        setChars({});
        addLog("⚠ Disconnected");
      });

    } catch (e) {
      addLog(`Connection failed: ${e.message}`);
      console.error(e);
    }
  };

  // ─── Commands ─────────────────────────────────────────────────────
  const sendChord = async (chordName) => {
    if (!chars.chordTarget) return;
    const { id } = CHORDS[chordName];
    const buf = new Uint8Array(20);
    buf[0] = 1; // version
    buf[1] = id; // chord_id
    buf[2] = 0; // pattern_id (accessible)
    try {
      await chars.chordTarget.writeValue(buf);
      setLastChord(chordName);
      addLog(`→ Chord: ${chordName}`);
    } catch (e) { addLog(`Chord error: ${e.message}`); }
  };

  const sendReaction = async (rxName) => {
    if (!chars.thermalReaction) return;
    const { id, intensity, duration } = REACTIONS[rxName];
    const buf = new Uint8Array([1, id, intensity, duration]);
    try {
      await chars.thermalReaction.writeValue(buf);
      setLastReaction(rxName);
      addLog(`→ Reaction: ${rxName}`);
    } catch (e) { addLog(`Reaction error: ${e.message}`); }
  };

  const emergencyOff = async () => {
    addLog("🚨 EMERGENCY OFF");
    // Thermal off
    if (chars.thermalMode) {
      try { await chars.thermalMode.writeValue(new Uint8Array([1, 0, 37, 30])); } catch (e) {}
    }
    // Glove intensity zero
    if (chars.handConfig) {
      try { await chars.handConfig.writeValue(new Uint8Array([1, 1, 3, 1, 0, 0, 0, 0])); } catch (e) {}
    }
    setLastChord(null);
    setLastReaction(null);
    addLog("All outputs killed");
  };

  // ─── Status labels ────────────────────────────────────────────────
  const statusLabel = (s) => ["Idle", "Warming", "Safety", "Low Batt"][s] || "?";
  const faultLabel = (f) => ["None", "Sensor", "Overtemp", "Watchdog"][f] || "?";
  const tempColor = (t) => t < 29 ? "#6AACBE" : t < 33 ? "#A09880" : t < 36 ? "#C8A060" : t < 38 ? "#D4A043" : "#D44";

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>Exodia Stage Hand</h1>
        <p style={S.subtitle}>Firmware Test Panel — single glove MVP</p>
      </div>

      {/* Connect */}
      <button onClick={connectGlove} style={S.connectBtn(connected)}>
        <span style={S.statusDot(connected)} />
        {connected ? `Connected: ${device?.name || "Exodia"}` : "Connect Glove"}
      </button>

      {/* Live Monitors */}
      <div style={S.section}>
        <p style={S.sectionTitle}>Live State</p>
        <div style={S.monitorGrid}>
          <div style={S.monitorCard}>
            <div style={S.monitorLabel}>Wrist Temp</div>
            <div style={{ ...S.monitorValue, color: tempColor(thermalState.temp_c) }}>
              {thermalState.temp_c.toFixed(1)}°
            </div>
            <div style={S.monitorSub}>
              {statusLabel(thermalState.status)} · {faultLabel(thermalState.fault_code)}
            </div>
          </div>
          <div style={S.monitorCard}>
            <div style={S.monitorLabel}>EMG Effort</div>
            <div style={S.monitorValue}>{emgState.effort_0_100}%</div>
            <div style={S.monitorSub}>Q:{emgState.quality}</div>
          </div>
          <div style={S.monitorCard}>
            <div style={S.monitorLabel}>Flexor RMS</div>
            <div style={{ ...S.monitorValue, fontSize: 20 }}>{emgState.flexor_rms.toFixed(3)}</div>
          </div>
          <div style={S.monitorCard}>
            <div style={S.monitorLabel}>Extensor RMS</div>
            <div style={{ ...S.monitorValue, fontSize: 20 }}>{emgState.extensor_rms.toFixed(3)}</div>
          </div>
        </div>
        {thermalState.battery_pct > 0 && (
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#555", fontFamily: "monospace" }}>
            Battery: {thermalState.battery_pct}%
          </div>
        )}
      </div>

      {/* Chord Buttons */}
      <div style={S.section}>
        <p style={S.sectionTitle}>Send Chord</p>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(CHORDS).map(([name, { color }]) => (
            <button
              key={name}
              onClick={() => sendChord(name)}
              style={{
                ...S.chordBtn(color),
                ...(lastChord === name ? { background: `${color}30`, boxShadow: `0 0 12px ${color}33` } : {}),
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Reaction Buttons */}
      <div style={S.section}>
        <p style={S.sectionTitle}>Send Reaction (warmth + haptic)</p>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(REACTIONS).map(([name, { icon }]) => (
            <button
              key={name}
              onClick={() => sendReaction(name)}
              style={{
                ...S.rxBtn,
                ...(lastReaction === name ? { background: "rgba(212,160,67,0.1)", borderColor: "#D4A04366" } : {}),
              }}
            >
              {icon} {name}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Off */}
      <button onClick={emergencyOff} style={S.killBtn}>
        EMERGENCY OFF
      </button>

      {/* Log */}
      <div style={{ ...S.section, marginTop: 14 }}>
        <p style={S.sectionTitle}>Log</p>
        <div style={S.log}>
          {log.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          {log.length === 0 && <span style={{ color: "#333" }}>No events yet</span>}
        </div>
      </div>
    </div>
  );
}
