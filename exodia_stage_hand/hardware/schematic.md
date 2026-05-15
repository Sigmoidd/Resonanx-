# Exodia Stage Hand — Wiring Schematic

## Wire Optimization: Shared V+ Bus

Motors and heater strips share ONE power rail. Switching happens on the GND side via MOSFETs. This means each finger only needs **one individual wire** (motor GND) — not two.

### Budget 3-Color Scheme
You can build the entire glove using just a standard 3-color wire pack (Red, Black, Yellow):

1. 🔴 **RED (1 wire):** The V+ Bus. Loops through all 4 motors and 6 heater strips.
2. ⚫ **BLACK (1 wire):** The Heater GND Bus. Connects all 6 heater strips to the IRLZ44N MOSFET.
3. 🟡 **YELLOW (4 wires):** Individual Motor GNDs. Each finger motor gets one yellow wire back to its 2N7000 MOSFET.

**Tip:** Distinguish the 4 yellow wires by marking the ends with 1–4 dots using a Sharpie, or by tying small knots to identify the fingers (1 knot = Index, 2 = Middle, etc.).

### Total wires from ESP32 area to fingers: 6
```
1× Red (V+ Bus)
1× Black (Heater GND Bus)
4× Yellow (Motor GNDs)
```

Compare to naive wiring: 2 per motor + 2 per heater × 5 zones = **18 wires**. We use **6**.

---

## Schematic

```
BATTERY 3.7V
    │
    ├──► TP4056 charger ──► physical slide switch
    │                              │
    │                          V+ RAIL
    │                              │
    ├──────────────────────────────┼──────────────────────────
    │          SHARED V+ BUS      │
    │     ┌────────┬────────┬─────┴────┬──────────┐
    │     │        │        │          │          │
    │  [PALM    [IDX      [MID      [RNG      [PNK
    │  HEATER]  HEATER]   HEATER]   HEATER]   HEATER]
    │     │     + MOTOR   + MOTOR   + MOTOR   + MOTOR
    │     │        │          │         │         │
    │     │     Motor GND  Motor GND Motor GND Motor GND
    │     │     (wire 2)   (wire 3)  (wire 4)  (wire 5)
    │     │        │          │         │         │
    │     │        ▼          ▼         ▼         ▼
    │     │     Q2(2N7000) Q3(2N7K) Q4(2N7K) Q5(2N7K)
    │     │     G←GPIO6    G←GPIO7  G←GPIO15 G←GPIO16
    │     │        │          │         │         │
    │     │        └──────────┴─────────┴─────────┘
    │     │                       │
    │     │                    GND RAIL
    │     │
    │  HEATER GND BUS (wire 6) ── all heater strips connect here
    │     │
    │     ▼
    │  Q1 (IRLZ44N)  ← GPIO4 (PWM, thermal control)
    │     │
    │     └──► GND RAIL
    │
    │
    ├──► THERMISTOR DIVIDER
    │    V+ ──[10K fixed]──┬──[NTC 10K]── GND
    │                      └──► GPIO5 (ADC)
    │
    ├──► MyoWare 2.0
    │    V+ → VIN,  GND → GND,  ENV → GPIO17 (ADC)
    │
    └──► ESP32-S3 (3V3/GND from regulator)
```

---

## Per-finger detail

Each finger has TWO components side by side on the dorsal proximal phalanx:

```
   FINGER (dorsal view, proximal phalanx)
   ┌─────────────────────────────┐
   │  ┌─────────┐  ┌─────────┐  │
   │  │ HEATER  │  │  MOTOR  │  │
   │  │ STRIP   │  │  (8mm)  │  │
   │  │ EeonTex │  │  0820   │  │
   │  │ ~2×1cm  │  │  coin   │  │
   │  └────┬────┘  └────┬────┘  │
   │       │            │       │
   └───────┼────────────┼───────┘
           │            │
    V+ tap─┤       V+ tap─┤   ← from shared V+ bus
           │            │
    Heater ├─►bus       Motor GND ──► individual wire to MOSFET
    GND bus│
```

### Solder points per finger (2 taps from bus + 1 individual wire):
- **V+ bus** passes through, solder tap to heater strip AND motor V+
- **Heater GND bus** passes through, solder tap to heater strip GND
- **Motor GND** — individual wire soldered to motor, routed back to ESP32

---

## Heater zone layout (glove, palm-side view)

```
        Index  Middle  Ring   Pinky
          │      │      │      │
     ┌────┴──────┴──────┴──────┴────┐
     │  [H1]   [H2]   [H3]   [H4]  │  ← finger-base heater strips
     │                              │
     │      ┌──────────────┐        │
     │      │              │        │
     │      │  [H5] PALM   │        │
     │      │  HEATER      │        │
     │      │  ~5cm × 4cm  │        │
     │      │              │        │
     │      └──────────────┘        │
     │                              │
     │   ┌────────────────────┐     │
     │   │  [H6] WRIST CUFF  │     │
     │   │  HEATER ~5cm × 3cm│     │
     │   │  + NTC THERMISTOR  │     │
     │   └────────────────────┘     │
     │                              │
     │   [ESP32 + battery pocket]   │
     └──────────────────────────────┘
```

All 6 heater zones (H1–H6) wired in parallel: same V+ bus, same GND bus, one MOSFET.

---

## GPIO Assignment Table

| GPIO | Function | Direction | Notes |
|------|----------|-----------|-------|
| 4    | Heater MOSFET (IRLZ44N) | PWM OUT | All heater zones, single switch |
| 5    | NTC Thermistor | ADC IN | Voltage divider with 10K fixed resistor |
| 6    | Motor IDX (2N7000) | PWM OUT | Index finger motor |
| 7    | Motor MID (2N7000) | PWM OUT | Middle finger motor |
| 15   | Motor RNG (2N7000) | PWM OUT | Ring finger motor |
| 16   | Motor PNK (2N7000) | PWM OUT | Pinky finger motor |
| 17   | MyoWare ENV output | ADC IN | Flexor EMG, chord hand |

---

## Current Budget (3.7V LiPo)

| Load | Est. Current | Duty |
|------|-------------|------|
| ESP32-S3 + BLE | ~80mA | Always on |
| All heaters (parallel) | ~500mA–1A | PWM 50–70% |
| 4× motors (all on) | ~300mA | Intermittent bursts |
| MyoWare sensor | ~10mA | Always on |
| **Peak total** | **~1.4A** | **Brief peaks only** |

1000mAh LiPo can deliver 1–2A continuous. Peak is within safe limits.
IRLZ44N handles 40A+. 2N7000 handles 200mA per motor (plenty for 8mm coins at ~80mA each).

---

## Wire routing (physical path along glove)

```
ESP32 (dorsal wrist)
    │
    ├── V+ bus: runs dorsal metacarpal ridge → branches at each knuckle
    ├── Heater GND bus: runs parallel to V+ bus (other side of hand)
    ├── Motor GND wires: bundled, branch off at each knuckle
    │
    ├── Thermistor: short leads to wrist cuff heater zone
    └── MyoWare: cable down forearm to flexor electrode site
```

Use **26AWG silicone wire** for buses, hot-glue to secure at each junction.
