# Exodia Stage Hand — Care Edition (Rev B)
## Design Specification v2.0

**Target deployment:** Memory care settings, musical support sessions, supervised home use with care partners and family.

**Design principle:** Zero exposed metal. Zero snag risk. Zero electrical shock risk. Soft and fabric-like comfort for participants.

---

## Technical Comparison: Evolution to Care Edition Rev B

| Constraint | MVP (Breadboard) | Care Edition Rev B |
|---|---|---|
| Exposed wires | Yes | **None** |
| Solder joints | Hand-soldered, exposed | **Conformal coated, fully enclosed** |
| PCB | Dev kit breakout | **Custom Rigid Controller PCB + Flex Glove Harness** |
| Enclosure | Sewn pocket | **Player-friendly TPU snap enclosure** |
| Snag risk | Moderate | **None — sub-0.15mm flex profile** |
| Skin contact with metal | Possible | **Impossible — polyimide coverlay** |
| Washability | No | **Detachable glove (FPC unplug) is hand-washable** |
| Grounding Topology | Shared GND | **Isolated Quiet Analog Ground vs. High-Current Heat Return** |
| Haptics | Single Motor/Zone | **Three dedicated LRA drivers (Low, Mid, High) with hardware triggers** |
| User Interface | Standard BLE UI | **Dementia-friendly serial RGB LED zone guides** |
| Cost per unit | ~$75 | **~$35–45 (batch of 5–10)** |

---

## Physical Architecture

```txt
┌────────────────────────────────────────────────────────┐
│           WRIST CONTROLLER ENCLOSURE (TPU, snap-fit)    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  RIGID CONTROLLER PCB (FR4, 2-layer)             │  │
│  │  - ESP32-S3 module (SMD)                         │  │
│  │  - TP4056 charging IC & battery protector        │  │
│  │  - AO3400A Heater MOSFET with 100K pull-down     │  │
│  │  - 3× DRV2605L Haptic Drivers (shared EN)        │  │
│  │  - TS3A5017 Dual 4:1 Analog Mux                  │  │
│  │  - USB-C port (charge only, interlocked)        │  │
│  │  - Slide switch cutout                           │  │
│  │  └───────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  1000mAh LiPo (foam-padded bay)                  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
          │
          │  ZIF connector (20-pin FPC cable)
          │
┌────────────────────────────────────────────────────────┐
│      FLEXIBLE GLOVE HARNESS (1-layer polyimide)        │
│                                                        │
│  Traces: 0.15mm thick, coverlay both sides             │
│  Bonded to glove interior with 3M 9485PC tape          │
│                                                        │
│  Power Traces:                                         │
│    - HEAT_V+ (Pins 1 & 2 parallel)                     │
│    - HEAT_RETURN (Pins 3 & 4 parallel to MOSFET drain)  │
│  LED Signals:                                          │
│    - LED_V+, LED_DATA, LED_GND                         │
│  Haptic Drivers Output:                                │
│    - Low LRA (Pins 8 & 9), Mid LRA (Pins 10 & 11)      │
│    - High LRA (Pins 12 & 13)                           │
│  Sensor Lines (Isolated quiet ANALOG_GND):             │
│    - THERMISTOR_SENSE (Pin 14)                         │
│    - ANALOG_GND / SENSOR_RETURN (Pin 15)               │
│    - CONTACT_SENSE (Pin 16)                            │
│    - FLEX_ID (Pin 17), SPARE_ANALOG (Pin 18)           │
│                                                        │
│  Pads on Glove:                                        │
│    - 3× LRA solder pads (Low, Mid, High LRA zones)      │
│    - 5× WS2812B/SK6812 addressable RGB LEDs            │
│    - EeonTex heater strip connections                  │
│    - NTC Thermistor pocket                             │
└────────────────────────────────────────────────────────┘
```

---

## Board 1: Rigid Wrist PCB (Rev B)

**Dimensions:** Target ~45mm × 35mm × 1.6mm (FR4 standard)

### Key design rules
- All SMD components, top side only.
- All copper traces kept on the inner side of the wrist — away from skin contact.
- USB-C port mechanically interlocked so the device cannot be worn while charging.
- ZIF connector (20-pin, 0.5mm pitch) for the flexible glove harness.
- Ground separation: High-current `HEAT_RETURN` and quiet `ANALOG_GND` are fully isolated on-board and only meet at a single star-ground point near the battery ground.
- Gate protection: The heater MOSFET (Q1) gate is fitted with a 100K resistor pulled down to GND so that the heater immediately cuts out if the ESP32-S3 crashes or GPIO pins float.

### Schematic Topology
```txt
USB-C (charge) ──► TP4056 ──► LiPo+ / LiPo-
                                │
                           Slide Switch
                                │
                             V+ RAIL (3.7V - 4.2V)
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
    ESP32-S3               AO3400A MOSFET       3× DRV2605L Drivers
   (3.3V LDO)            (gate to 100K pulldown)  (SCL/SDA in parallel)
        │                       │                       │
   GPIO38 (RGB) ──► ZIF       Gate ◄── GPIO25       Shared EN ◄── GPIO21
   GPIO8  (ADC1) ◄── Mux      Drain ◄─► HEAT_GND    DRV_TRIG1 ◄── GPIO24
   GPIO9  (ADC2) ◄── Mux                            DRV_TRIG2 ◄── GPIO11
   GPIO39/40 ──► Mux S0/S1                          DRV_TRIG3 ◄── GPIO12
```

---

## Board 2: Flexible Glove Harness (Rev B)

**Material:** Polyimide (Kapton), 1-layer, 0.1mm substrate.
**Coverlay:** Both sides (only solder pads exposed).
**Trace width:** 0.6mm for heater current paths, 0.2mm for signal lines.
**Connector:** 20-pin ZIF tail on wrist end, 0.5mm pitch.

### FPC 20-Pin Mapping
| Pin | Name | Description |
|---|---|---|
| 1 | `HEAT_V+` | Heater Power (Parallel Pin 1) |
| 2 | `HEAT_V+` | Heater Power (Parallel Pin 2) |
| 3 | `HEAT_RETURN` | Heater Ground Return (Parallel Pin 1) |
| 4 | `HEAT_RETURN` | Heater Ground Return (Parallel Pin 2) |
| 5 | `LED_V+` | 3.3V Supply for addressable serial LEDs |
| 6 | `LED_DATA` | WS2812B/SK6812 Serial Data line |
| 7 | `LED_GND` | Quiet LED power return |
| 8 | `LRA_LOW+` | Haptic Driver 1 output (+) |
| 9 | `LRA_LOW-` | Haptic Driver 1 output (-) |
| 10 | `LRA_MID+` | Haptic Driver 2 output (+) |
| 11 | `LRA_MID-` | Haptic Driver 2 output (-) |
| 12 | `LRA_HIGH+` | Haptic Driver 3 output (+) |
| 13 | `LRA_HIGH-` | Haptic Driver 3 output (-) |
| 14 | `THERMISTOR_SENSE`| Thermistor voltage junction |
| 15 | `ANALOG_GND` | Quiet Sensor Ground / Analog return |
| 16 | `CONTACT_SENSE` | Contact sensor analog line |
| 17 | `FLEX_ID` | Flex resistance signature / ID line |
| 18 | `SPARE_ANALOG` | Future analog input channel |
| 19 | `GLOVE_PRESENT` | Connection detection line (pulled down when glove is plugged in) |
| 20 | `GND_SHIELD` | Frame ground / Shield |

---

## Assembly Steps (per unit)

### Stage 1 — Wrist Controller PCB
1. Order bare FR4 boards (2-layer, 45×35mm, lead-free finish).
2. Place surface-mount components: ESP32-S3 module, TP4056, LDO, three DRV2605L drivers, TS3A5017 multiplexer, MOSFET, passives, and the 20-pin ZIF socket.
3. Reflow on hot plate or conveyor oven.
4. Flash the boot code and calibrate haptic drivers via USB-C.
5. Apply conformal coat (e.g., MG Chemicals 422B) to protect components from sweat and humidity.

### Stage 2 — Flex Glove Harness
1. Order 1-layer polyimide flex harnesses from a quick-turn pool.
2. Insert the ZIF tail into the wrist PCB connector, verify alignment, and secure the flip lock.
3. Apply 3M 9485PC high-performance adhesive tape to the back of the polyimide strip.
4. Carefully thread the harness inside the glove lining, press firmly to bond, and secure with the molded silicone strain-relief sleeve at the wrist transition.

### Stage 3 — Component Solder Points
1. Solder the three LRA coin actuators to their corresponding pads (Low, Mid, High zones) on the finger backs.
2. Solder the EeonTex fabric warmth strips to the heater pads. **Heater fabric calibration:** Cut the fabric sheet to a 2:1 aspect ratio (approx. 5.0cm × 2.5cm) to establish a baseline resistance of **10 to 12 ohms** to enforce safety current limits (~300-350mA).
3. Secure the 10K NTC thermistor inside the pocket direct-to-skin (beneath the fabric heater). Solder its leads to the sense traces.
4. Mount the five serial addressable RGB LEDs near the finger backs.
5. Coat all solder points with a localized drop of conformal coat to ensure 100% moisture resistance.

### Stage 4 — Final Casing
1. Insert the wrist PCB and LiPo battery into the foam-lined rounded TPU casing.
2. Snap the screwless enclosure shut.
3. Ensure the glove and electronics assembly is secure, comfortable, and has zero sharp boundaries.

---

## Safety Checklist (Before Session Deployment)

```txt
[ ] Conformal coating completely dry and fully cured.
[ ] Hardware default test: Verify MOSFET gate (Q1) pulldown shuts off heater if control line floats.
[ ] Open circuit cutoff: Disconnect thermistor, verify ADC registers 3.3V (4095) and cuts power immediately.
[ ] Thermal limit check: Warm thermistor to 40°C, confirm firmware enforces shutdown.
[ ] Current validation: Confirm current draw under full warmth is below 400mA.
[ ] Firmware LED cap: Ensure serial addressable RGB LED brightness is capped at 15% to limit heat.
[ ] No exposed solder contacts or snag hazards are present on the glove or wristband.
[ ] Slide switch cuts battery power instantly when switched off.
[ ] Device cannot be worn while plugged into a USB charger (mechanical lock in place).
[ ] BLE connects cleanly to the care partner controller panel.
[ ] Three LRA zones trigger independently on command.
```

---

## Safety Thresholds & Limits (Enforced in Firmware)
- **Target Warming Temperature:** 37°C
- **Emergency Hardware Cutoff:** 40°C (any reading at or above this instantly drops the heater MOSFET control pin)
- **Sensor Fault Timeout:** 100ms (frequent polling; open or short-circuit readings immediately disable the heater)
- **BLE Safety Heartbeat:** 30s timeout (if the care partner application disconnects, all heat and haptic activities cease immediately)
- **Operational Voltage:** 3.7V nominal, fully isolated — zero risk of electrical shock.
