# Exodia Stage Hand MVP — Bill of Materials & Sourcing Guide

> **Estimated total: ~$115–$145** for one complete glove station.
> Single board. Single glove. Single BLE connection.

---

## Exodia Stage Hand Glove (all-in-one)

| # | Component | Qty | Est. Price | Source | Notes |
|---|-----------|-----|-----------|--------|-------|
| 1 | **ESP32-S3 DevKitC** | 1 | $8–12 | [Amazon](https://www.amazon.com/s?k=ESP32-S3+DevKitC) / [AliExpress](https://www.aliexpress.com/w/wholesale-esp32-s3-devkit.html) | **One board runs everything.** Get 8MB flash + PSRAM. Search "ESP32-S3 DevKitC-1". |
| 2 | **EeonTex Heater Fabric NW170-PI-20** | 1 sheet | $19.95 | [Adafruit #3670](https://www.adafruit.com/product/3670) | **12"×13" sheet, 0.6mm thick, 20 Ω/sq.** Cut a wrist-cuff piece and sew into glove. Plenty left over for spares or a second glove. |
| 3 | **IRLZ44N MOSFET** (heater driver) | 1 | $1–2 | [DigiKey](https://www.digikey.com/en/products/detail/infineon-technologies/IRLZ44NPBF/811794) / [Amazon](https://www.amazon.com/s?k=IRLZ44N+MOSFET) | Drives heater fabric via PWM from ESP32 3.3V GPIO. |
| 4 | **10K NTC Thermistor** (B3950, waterproof) | 1 | $1–3 | [Amazon](https://www.amazon.com/s?k=10K+NTC+thermistor+waterproof) | Small probe (4mm×20mm). Sits between heater fabric and skin liner. Safety sensor. |
| 5 | **Coin vibration motors** (8mm 0820, 3V) | 4 | $5–8 (pack of 10) | [Amazon](https://www.amazon.com/s?k=8mm+coin+vibration+motor+0820) | **Get 8mm (0820 series)**. They weigh <1g and are only 2mm thick. Keep weight off the fingers. Leaded, self-adhesive. Buy the 10-pack. |
| 6 | **Small N-ch MOSFETs** (2N7000) | 4 | $2–3 | [DigiKey](https://www.digikey.com/) / [Amazon](https://www.amazon.com/s?k=2N7000+MOSFET) | One per motor. Simple PWM on/off. |
| 7 | **MyoWare 2.0 Muscle Sensor** | 1 | $40 | [SparkFun DEV-27924](https://www.sparkfun.com/products/27924) / [DigiKey](https://www.digikey.com/) | **Chord hand flexor only.** DEV-27924 is the current active part. Extensor deferred. Do NOT buy from AliExpress. |
| 8 | **Disposable Ag/AgCl electrodes** | 1 pack (50) | $8–15 | [Bio-Medical.com](https://bio-medical.com) / [Amazon](https://www.amazon.com/s?k=Ag+AgCl+disposable+electrode) | Snap-type, pre-gelled. Match connector to MyoWare snap leads. |
| 9 | **3.7V LiPo battery, 1000mAh** | 1 | $6–9 | [Amazon](https://www.amazon.com/s?k=3.7V+1000mAh+LiPo+battery+JST) / [Adafruit](https://www.adafruit.com/product/1578) | 1000mAh recommended — heater + motors + EMG + BLE all on one battery. |
| 10 | **TP4056 USB-C charger board** (w/ protection) | 1 | $1–2 | [Amazon](https://www.amazon.com/s?k=TP4056+USB-C+charger+board) | Get the version with overdischarge + short-circuit protection. |
| 11 | **Fingerless compression glove** | 1 | $8–12 | [Amazon](https://www.amazon.com/s?k=fingerless+compression+glove) | Motors on dorsal proximal phalanx. Heater fabric sewn into wrist cuff. |
| 12 | **Flexible silicone wire, 26AWG** | 1 kit | $6–8 | [Amazon "BNTECHGO 26AWG"](https://www.amazon.com/s?k=BNTECHGO+26AWG+silicone+wire) / [Adafruit](https://www.adafruit.com/product/1970) | Multi-color kit. Routes ESP32 → motors and heater. |
| 13 | **SPDT mini slide switch** | 1 | $0.50 | Amazon / DigiKey | Physical power kill. Non-negotiable. |

**Glove subtotal (without EMG): ~$55–75**
**Glove subtotal (with EMG): ~$115–145**

---

## Shared / Misc

| # | Component | Qty | Est. Price | Notes |
|---|-----------|-----|-----------|-------|
| 1 | Breadboard + jumper wires | 1 | $3 | Prototyping before soldering |
| 2 | Protoboard (half-size) | 1 | $2 | Final solder-up |
| 3 | Heat shrink tubing | 1 | $4 | Insulate joints |
| 4 | Hot glue gun + sticks | 1 | $8 | Motor attachment, sealing |

**Misc subtotal: ~$17**

---

## Shopping Strategy

> [!IMPORTANT]
> Buy in this order. Each cart unlocks the next milestone.

**Cart 1 — Milestones 1+2 (heat + haptic):**
```
1× ESP32-S3 DevKitC
1× EeonTex Heater Fabric (Adafruit #3670)
1× IRLZ44N MOSFET (heater)
1× 10K NTC thermistor
4× 8mm (0820) coin vibration motors (buy 10-pack)
4× 2N7000 MOSFETs (motors)
1× 3.7V LiPo 1000mAh
1× TP4056 USB-C charger
1× Fingerless compression glove
1× 26AWG silicone wire kit
1× Slide switch
```
→ **~$65–85.** Proves warmth + chord buzz on one glove.

**Cart 2 — Milestone 3 (EMG read-only):**
```
1× MyoWare 2.0 Muscle Sensor (DEV-27924) — flexor, chord hand
1× 50-pack Ag/AgCl electrodes
```
→ **~$48–55.** Adds effort sensing. One sensor proves the concept.

### Where to buy (by speed)

| Speed | Store | Best for |
|-------|-------|----------|
| 🟢 2-day | Amazon | ESP32, batteries, glove, wire, thermistor, chargers, MOSFETs, motors |
| 🟢 2-day | Adafruit | EeonTex heater fabric (#3670) |
| 🟢 2-day | SparkFun | MyoWare 2.0 sensors (DEV-27924) |
| 🟡 3-5 day | DigiKey | MOSFETs if Amazon is out |

> [!WARNING]
> **Do NOT source MyoWare sensors from AliExpress.** Counterfeit risk is high. Buy from SparkFun or DigiKey only.

### What changed from the two-board design

| | Two-board (old) | Single-glove (current) |
|---|---|---|
| ESP32 boards | 2 | **1** |
| BLE connections | 2 | **1** |
| Batteries | 2 | **1** |
| MyoWare sensors | 2 | **1** (flexor only) |
| Devices to debug | 2 | **1** |
| Estimated cost | ~$180–230 | **~$115–145** |
| Wrist band | Separate device | **Heater fabric sewn into glove cuff** |
