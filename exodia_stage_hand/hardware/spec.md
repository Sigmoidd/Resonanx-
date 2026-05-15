# Minimum Viable Build: Exodia Stage Hand + Resonance

## MVP goal
Build **one working family music station**:
```txt
Phone running Resonance app
    ↓ BLE (single connection)
Exodia Stage Hand glove
  — buzzes chord fingers (haptic)
  — warms wrist area (EeonTex heater fabric)
  — reports effort (EMG read-only)
```
One glove. One ESP32. One BLE connection. Proves the sensory loop.

## Architecture — single board

```txt
┌─────────────────────────────────────────────┐
│             EXODIA STAGE HAND               │
│                                             │
│  ESP32-S3 (single MCU)                      │
│  ├── GPIO PWM → MOSFET → EeonTex heater     │
│  ├── ADC      ← NTC thermistor (safety)     │
│  ├── GPIO PWM → 4× MOSFET → 4× vibe motors │
│  ├── ADC      ← MyoWare (flexor, chord hand)│
│  └── BLE      ↔ Resonance app               │
│                                             │
│  Power: 3.7V LiPo + TP4056 charger          │
│  Safety: physical switch + firmware cutoffs  │
└─────────────────────────────────────────────┘
```

## MVP hardware — single glove

| Zone | Component | Purpose |
|------|-----------|---------|
| Wrist cuff | EeonTex heater strip (~5×3cm) | Warmth zone H6 |
| Wrist cuff | 10K NTC thermistor | Safety temperature monitoring |
| Palm | EeonTex heater strip (~5×4cm) | Warmth zone H5 |
| Index base | EeonTex heater strip (~2×1cm) + 8mm motor | Warmth H1 + chord cue |
| Middle base | EeonTex heater strip (~2×1cm) + 8mm motor | Warmth H2 + chord cue |
| Ring base | EeonTex heater strip (~2×1cm) + 8mm motor | Warmth H3 + chord cue |
| Pinky base | EeonTex heater strip (~2×1cm) + 8mm motor | Warmth H4 + chord cue |
| Forearm (flexor) | MyoWare 2.0 sensor | Effort read-only (chord hand only) |
| Dorsal wrist | ESP32-S3 + battery pocket | Brain + power |

Do not put anything on the fingertips. He needs string contact.

### Wiring: shared V+ bus (6 wires total instead of 18)
```txt
V+ bus:        1 wire, runs dorsal metacarpal → taps at each finger
Heater GND:    1 wire, bus connecting all 6 heater strips → 1 MOSFET
Motor GND:     4 wires, one per finger → individual MOSFET each
Total:         6 wires from ESP32 area to fingers
```
All heater zones (H1–H6) wired in parallel, driven by single IRLZ44N.
Each motor switched independently by its own 2N7000.
See `docs/glove_schematic.md` for full circuit diagram.

### Parts list
```txt
ESP32-S3 dev board (1×)
EeonTex NW170-PI-20 heater fabric (Adafruit #3670)
  — cut 6 pieces from one 12"×13" sheet:
    H1–H4: ~2×1cm finger base strips
    H5:    ~5×4cm palm piece
    H6:    ~5×3cm wrist cuff piece
  — all wired in parallel on shared V+/GND buses
IRLZ44N MOSFET — heater PWM driver (1×, drives all zones)
10K NTC thermistor B3950 waterproof probe (1×)
4× 8mm coin vibration motors (0820 series, 3V, <1g each)
4× 2N7000 N-ch MOSFETs — individual motor drivers
1× MyoWare 2.0 sensor (DEV-27924) — flexor side, chord hand
Disposable Ag/AgCl electrodes (50-pack)
3.7V LiPo battery 1000mAh
TP4056 USB-C charger board (with protection)
Fingerless compression glove
26AWG flexible silicone wire
Physical power switch (SPDT slide)
```

### Thermal behavior
```txt
Idle: heater off
Chord close: gentle warmth at wrist
Chord landed: short warm bloom
Family love: slow warm swell
Family applause: short warm pulse
Safety fault: heater off immediately
```

### Hard limits
```txt
Normal target max: 37°C
Absolute firmware cutoff: 40°C
Sensor fail: heater off
BLE timeout: heater off
Physical switch: always present
Battery only during use
```

### Motor placement
```txt
Index finger: dorsal proximal phalanx
Middle finger: dorsal proximal phalanx
Ring finger: dorsal proximal phalanx
Pinky finger: dorsal proximal phalanx
```

### EMG — single sensor, read-only first
One MyoWare on the **chord hand flexor** only. Flexor RMS = fingers curling = chord attempt.
Day-one EMG does **not** control assist yet. It only reports:
```txt
flexor_rms
effort_score (0-100, from flexor alone)
signal_quality
calibrated true/false
```
Extensor sensor deferred — add it later if flexor-only proves insufficient.

## What not to build yet
```txt
No separate thermal wrist band (heater is in the glove now)
No second ESP32
No full EMG fading algorithm yet
No perfect pitch/chord scoring dependency
No remote family relay dependency
No foot tap puck yet
No enclosure polish
No multi-profile analytics
No automatic therapy claims
```

## MVP firmware contract — single device

Both services run on ONE ESP32 over ONE BLE connection.

### Thermal service
```txt
THERMAL_SERVICE = 0000aaaa-0000-1000-8000-00805f9b34fb
ThermalMode      0000aaa2... write
ThermalState     0000aaa3... notify
ThermalReaction  0000aaa5... write
```

### Stage Hand service
```txt
STAGE_HAND_SERVICE = 0000bbbb-0000-1000-8000-00805f9b34fb
HandConfig       0000bbb0... write
ChordTarget      0000bbb1... write
AssistLevel      0000bbb2... write
EMGState         0000bbb3... notify
HapticEvent      0000bbb5... write
```

Both services advertised by the same device. App connects once, discovers both.

## MVP build order

### Milestone 1 — heater in glove
Goal: app button warms wrist area of glove safely.
```txt
ESP32 reads thermistor
ESP32 controls heater fabric with PWM via MOSFET
BLE receives ThermalReaction
Firmware enforces temp cap
App button sends Love / Success / Off
```

### Milestone 2 — haptic chord guidance
Goal: app sends G/C/D/Em/Am and the right fingers buzz.
```txt
ESP32 controls 4 motors via MOSFETs
BLE receives ChordTarget
BLE receives HapticEvent
Low-arousal mode softens everything
```

### Milestone 3 — EMG read-only
Goal: glove reports effort score from chord hand flexor.
```txt
Read 1 MyoWare analog channel (flexor)
2-second baseline calibration on boot
Compute RMS, subtract baseline
Normalize effort 0-100
Notify EMGState at 10 Hz
```

### Milestone 4 — integrated sensory loop
Goal: one button in app drives the full station.
```txt
Family sends Love → wrist warms + fingers pulse gently
Chord landed → warm bloom + success pulse
Session saves as favorite performance
```

## Minimum app controls
Firmware Test Panel:
```txt
Connect Exodia Stage Hand (single device)
Send G / C / D / Em / Am
Send Spark / Applause / Love / Success
Show EMG effort %
Show thermal temp °C
Emergency Off
```

## MVP definition of done
```txt
1. Open Resonance on phone.
2. Connect Exodia Stage Hand glove (one BLE connection).
3. Select hand side and role.
4. Send G chord — correct fingers buzz.
5. Curl hand — EMG effort rises.
6. Press Love — wrist warms gently and fingers pulse.
7. Press Chord Landed — warm bloom + session saves.
```
