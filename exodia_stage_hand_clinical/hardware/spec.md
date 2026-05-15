# Exodia Stage Hand — Clinical Edition
## Design Specification v1.0

**Target deployment:** Memory care facilities, clinical music therapy, supervised home use with vulnerable adults.

**Design principle:** Zero exposed metal. Zero snag risk. Zero electrical shock risk. Feels like fabric.

---

## Why This Is a Different Design

The MVP (breadboard build) proves the sensory loop. This build deploys it safely.

| Constraint | MVP | Clinical |
|---|---|---|
| Exposed wires | Yes | **None** |
| Solder joints | Hand-soldered, exposed | **Conformal coated, enclosed** |
| PCB | Dev kit breakout | **Custom rigid + flex** |
| Enclosure | Sewn pocket | **TPU snap enclosure** |
| Snag risk | Moderate | **None — sub-0.15mm flex profile** |
| Skin contact with metal | Possible | **Impossible — polyimide coverlay** |
| Washability | No | **Spot-safe with conformal coat** |
| Cost per unit | ~$75 | **~$27–33 (batch of 5–10)** |

---

## Physical Architecture

```txt
┌────────────────────────────────────────────────┐
│           WRIST ENCLOSURE (TPU, snap-fit)       │
│  ┌──────────────────────────────────────────┐  │
│  │  RIGID WRIST PCB (FR4, 2-layer)          │  │
│  │  - ESP32-S3 module (SMD)                 │  │
│  │  - TP4056 IC (SMD)                       │  │
│  │  - IRLZ44N heater MOSFET                 │  │
│  │  - 4× 2N7000 motor MOSFETs              │  │
│  │  - NTC voltage divider                   │  │
│  │  - USB-C port (charge only)              │  │
│  │  - Slide switch cutout                   │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  1000mAh LiPo (foam-padded bay)          │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
         │
         │  ZIF connector (5-pin flat cable)
         │
┌────────────────────────────────────────────────┐
│      FLEXIBLE FINGER HARNESS (1-layer polyimide)│
│                                                 │
│  Traces: 0.15mm thick, coverlay both sides      │
│  Bonded to glove interior with 3M 9485PC tape   │
│                                                 │
│  ┌──── V+ bus trace ─────────────────────────► │
│  ├──── Heater GND trace ──────────────────────► │
│  ├──── Motor GND IDX ──────────────────────────► │
│  ├──── Motor GND MID ──────────────────────────► │
│  ├──── Motor GND RNG ──────────────────────────► │
│  └──── Motor GND PNK ──────────────────────────► │
│                                                 │
│  Pads at each finger:                           │
│    - Motor solder pad (0820 coin, SMD footprint)│
│    - Heater fabric solder pad (EeonTex tab)     │
└────────────────────────────────────────────────┘
```

---

## Board 1: Rigid Wrist PCB

**Dimensions:** Target ~40mm × 30mm × 1.6mm (FR4 standard)

### Key design rules
- All SMD components, top side only
- All copper on inner side of wrist — away from skin
- USB-C port recessed in TPU enclosure cutout
- Slide switch accessible through TPU slot
- ZIF connector (5-pin, 0.5mm pitch) for flex harness
- Conformal coat entire board with MG Chemicals 422B after assembly

### Schematic (logical)
```txt
USB-C (charge in) → TP4056 IC → LiPo+ / LiPo-
                                    │
                               Slide Switch
                                    │
                                 V+ RAIL
                    ┌──────────────┼───────────────┐
                    │              │               │
               ESP32-S3       IRLZ44N          4× 2N7000
               (3V3 reg)    (heater MOSFET)  (motor MOSFETs)
                    │              │               │
               GPIO4 → G      Drain → ZIF      G ← GPIO6/7/15/16
                    │         pin 1 (V+)       D → ZIF pins 2-5
               GPIO5 → ADC                    S → GND
               (thermistor)
               GPIO17 → ADC
               (MyoWare, via
                ZIF pin 5 alt)
```

---

## Board 2: Flexible Finger Harness

**Material:** Polyimide (Kapton), 1-layer, 0.1mm substrate
**Coverlay:** Both sides (only pads exposed)
**Trace width:** 0.5mm for power bus, 0.3mm for signal
**Connector:** 5-pin ZIF tail on wrist end, 0.5mm pitch

### Harness layout
```txt
ZIF tail (wrist)
    │
    ├─ [V+ bus trace] ────────────────────────────────►
    │     │           │           │           │
    │  IDX pad     MID pad     RNG pad     PNK pad
    │  (heater+    (heater+    (heater+    (heater+
    │   motor V+)   motor V+)   motor V+)   motor V+)
    │
    ├─ [Heater GND trace] ───────────────────────────►
    │     │           │           │           │
    │  IDX heater  MID heater  RNG heater  PNK heater
    │  GND pad     GND pad     GND pad     GND pad
    │
    ├─ [Motor GND IDX trace] ────────────────────────►
    │     └── IDX motor GND pad
    │
    ├─ [Motor GND MID trace] ────────────────────────►
    │     └── MID motor GND pad
    │
    ├─ [Motor GND RNG trace] ────────────────────────►
    │     └── RNG motor GND pad
    │
    └─ [Motor GND PNK trace] ────────────────────────►
          └── PNK motor GND pad
```

**Palm heater** (H5) connects between IDX and MID zones via short branch trace.
**Wrist heater** (H6) connects on ZIF via a 6th pad (add to wrist PCB directly, no harness needed).

---

## Assembly Steps (per unit)

### Stage 1 — Wrist PCB
1. Order bare boards from JLCPCB (2-layer FR4, 40×30mm, qty 5)
2. Apply solder paste with laser stencil
3. Place SMD components: ESP32-S3 module, TP4056, MOSFETs, passives, ZIF socket
4. Reflow (hot plate or oven)
5. Flash firmware via USB-C before enclosure
6. Brush MG Chemicals 422B conformal coat, cure 30 min

### Stage 2 — Flex harness
1. Order from JLCPCB flex pool (1-layer polyimide, qty 5, ~$25 total)
2. Insert ZIF tail into wrist PCB socket, lock
3. Apply 3M 9485PC medical tape to harness back
4. Position harness inside glove lining, press flat, bond permanently

### Stage 3 — Components on harness
1. Solder 8mm 0820 coin motors to motor pads (tiny dab of solder)
2. Solder EeonTex heater strip tabs to heater pads
3. Position NTC thermistor at wrist heater zone, solder leads to wrist PCB thermistor pads
4. Dot each motor pad with additional conformal coat drop

### Stage 4 — Enclosure
1. Print TPU wrist enclosure (rounded, no sharp edges, screw-less snap fit)
2. Insert wrist PCB + LiPo into enclosure
3. Snap closed
4. Route ZIF cable through slot into glove interior

---

## Safety Checklist (per unit, before deployment)

```txt
☐ Conformal coat fully cured (30 min minimum, ideally 2hr)
☐ Thermal cutoff test: apply gentle heat to NTC, verify heater shuts off at 40°C
☐ BLE connects cleanly to test panel
☐ All 4 motors buzz on chord command
☐ Slide switch cuts all power
☐ No exposed solder joints visible
☐ Flex harness fully bonded, no lifting edges
☐ Enclosure snap is firm, no sharp edges
☐ Fully charged before deployment
☐ Label: "LOW VOLTAGE DEVICE — 3.7V ONLY"
```

---

## Hard limits (same as MVP, enforced in hardware + firmware)
```txt
Normal target max: 37°C
Absolute firmware cutoff: 40°C
NTC sensor fail: heater off immediately
BLE timeout (30s): heater off, motors off
Slide switch: always accessible
Battery: LiPo, protected by TP4056 IC
Voltage: 3.7V nominal — no shock risk
```
