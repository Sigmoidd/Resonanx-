# Exodia Stage Hand Clinical — Bill of Materials & Manufacturing Guide

> **First run cost: ~$135–$165 total for 5 units (~$27–33 per unit)**
> Fully sealed. No exposed metal. Safe for memory care deployment.

---

## Part 1: PCB Fabrication (order once, covers 5 units)

| # | Item | Qty | Est. Cost | Source | Notes |
|---|------|-----|-----------|--------|-------|
| 1 | **Rigid Wrist PCB** (2-layer FR4, 40×30mm) | 5 | ~$5 | [JLCPCB](https://jlcpcb.com) | Standard 2-layer. Upload Gerbers. Heavily subsidized first-run pricing. |
| 2 | **Flex Finger Harness** (1-layer polyimide, custom) | 5 | ~$25 | [JLCPCB Flex](https://jlcpcb.com/pcb-assembly) | 1-layer polyimide flex pool. Coverlay both sides. 0.1mm substrate. |
| 3 | **Laser solder stencil** (for wrist PCB) | 1 | ~$10 | [JLCPCB](https://jlcpcb.com) | Required for precise SMD paste. Order with the PCBs. |

**Fabrication subtotal: ~$40**

---

## Part 2: SMD Components (per 5-unit batch)

| # | Component | Qty (×5) | Est. Cost | Source | Notes |
|---|-----------|----------|-----------|--------|-------|
| 1 | **ESP32-S3 module** (SMD, e.g. ESP32-S3-MINI-1) | 5 | ~$20 | [LCSC](https://www.lcsc.com/search?q=esp32-s3-mini) / [DigiKey](https://www.digikey.com) | SMD module, not dev kit. Castellated pads. 8MB flash. |
| 2 | **TP4056 IC** (SOT-23-8 or SOP-8) | 5 | ~$3 | [LCSC](https://www.lcsc.com/search?q=TP4056) | LiPo charge controller IC. |
| 3 | **IRLZ44N MOSFET** (TO-252 SMD) | 5 | ~$5 | [DigiKey](https://www.digikey.com) / [LCSC](https://www.lcsc.com) | Heater driver. Logic-level. TO-252 (D-PAK) SMD package. |
| 4 | **2N7002 N-ch MOSFET** (SOT-23, SMD) | 20 | ~$3 | [LCSC](https://www.lcsc.com/search?q=2N7002) | Motor drivers. 4 per unit. SOT-23 SMD. (2N7002 = SMD equiv of 2N7000) |
| 5 | **10K resistor** 0402, ×2 per board | 10 | ~$1 | [LCSC](https://www.lcsc.com) | NTC voltage divider + pull-down. |
| 6 | **100nF decoupling caps** 0402 | 10 | ~$1 | [LCSC](https://www.lcsc.com) | Power supply bypass. |
| 7 | **USB-C connector** (SMD, 16-pin) | 5 | ~$4 | [LCSC](https://www.lcsc.com/search?q=usb+c+16+pin+smd) | Charge port. Data lines unused. |
| 8 | **ZIF connector** (5-pin, 0.5mm pitch, SMD) | 5 | ~$4 | [LCSC](https://www.lcsc.com/search?q=ZIF+5+pin+0.5mm) | Flex harness interface. |
| 9 | **SPDT slide switch** (SMD or through-hole) | 5 | ~$2 | [LCSC](https://www.lcsc.com) | Physical power kill. |

**SMD subtotal: ~$43**

---

## Part 3: Wearable Components (per 5-unit batch)

| # | Component | Qty | Est. Cost | Source | Notes |
|---|-----------|-----|-----------|--------|-------|
| 1 | **EeonTex NW170-PI-20 heater fabric** | 2 sheets | ~$40 | [Adafruit #3670](https://www.adafruit.com/product/3670) | 2 sheets yields 5 full sets of heater zones (6 cuts per unit). |
| 2 | **8mm 0820 coin vibration motors** | 1 pack (20) | ~$10 | [Amazon](https://www.amazon.com/s?k=8mm+coin+vibration+motor+0820) | 4 per unit. Buy 20-pack for spares. |
| 3 | **10K NTC thermistor** (B3950, waterproof) | 5 | ~$5 | [Amazon](https://www.amazon.com/s?k=10K+NTC+thermistor+waterproof) | One per unit, wrist zone. |
| 4 | **LiPo 1000mAh** (3.7V, JST, flat) | 5 | ~$30 | [Amazon](https://www.amazon.com/s?k=3.7V+1000mAh+LiPo+flat) / [Adafruit](https://www.adafruit.com/product/2011) | Flat profile to fit wrist enclosure. |
| 5 | **Fingerless compression gloves** | 5 | ~$40 | [Amazon](https://www.amazon.com/s?k=fingerless+compression+glove) | One per unit. |

**Wearable subtotal: ~$125**

---

## Part 4: Safety & Sealing Materials (shared across batch)

| # | Component | Qty | Est. Cost | Source | Notes |
|---|-----------|-----|-----------|--------|-------|
| 1 | **3M 9485PC Medical Transfer Tape** | 1 roll | ~$15 | [Amazon](https://www.amazon.com/s?k=3M+9485PC) / [McMaster-Carr](https://www.mcmaster.com) | Bonds flex PCB permanently to glove interior. Medical-grade, skin-safe. |
| 2 | **MG Chemicals 422B Conformal Coat** | 1 can | ~$20 | [Amazon](https://www.amazon.com/s?k=MG+Chemicals+422B) / [DigiKey](https://www.digikey.com) | Silicone-based. Paint over all solder joints. Waterproof, flexible. |
| 3 | **TPU filament** (for wrist enclosures) | 250g | ~$15 | [Amazon](https://www.amazon.com/s?k=TPU+filament+flexible) | Flexible, smooth, no sharp edges. ~30g per unit. |

**Safety subtotal: ~$50**

---

## Summary

| Phase | Cost |
|-------|------|
| PCB fabrication (boards + stencil) | ~$40 |
| SMD components (5-unit batch) | ~$43 |
| Wearable components | ~$125 |
| Safety & sealing | ~$50 |
| **Total for 5 units** | **~$258** |
| **Per-unit cost** | **~$52** |

> [!NOTE]
> The $27–33/unit figure from the initial brief assumes you already have conformal coat, TPU printer, and tape from a previous run. Your true **first-run** cost is ~$52/unit. Runs 2+ drop to ~$30/unit as shared materials carry forward.

---

## Manufacturing Order of Operations

### Step 1 — Place PCB order (lead time: 5–7 days)
1. Export Gerbers from KiCad/EasyEDA
2. Order at JLCPCB: rigid board + flex harness + stencil in one order
3. Order SMD components from LCSC concurrently (same parent company, ships together)

### Step 2 — Order wearables (lead time: 2–3 days)
```
5× fingerless compression gloves
2× EeonTex heater fabric sheets (Adafruit)
20× 8mm 0820 coin motors
5× 10K NTC thermistors
5× LiPo batteries
```

### Step 3 — Order safety materials (lead time: 2–3 days)
```
3M 9485PC tape
MG Chemicals 422B conformal coat
TPU filament (if printing enclosures yourself)
```

### Step 4 — Assembly (when all parts arrive)
See `spec.md` Assembly Steps (Stages 1–4)

### Step 5 — Flash & test
Flash firmware via USB-C before sealing in enclosure.
Run through `Safety Checklist` in `spec.md` for every unit.

---

## JLCPCB Order Tips

> [!IMPORTANT]
> These steps minimize cost and lead time.

1. **Rigid board:** Set quantity to 5, select "FR4", 1.6mm, HASL finish, no special options. Will be ~$2 with shipping.
2. **Flex board:** Select "Flexible PCB" tab. Set to 1-layer, polyimide, coverlay both sides. Qty 5 ~$25 with shipping.
3. **Stencil:** Order at same time as rigid board. Select "top only" (components on top side only).
4. **LCSC components:** Add to cart at lcsc.com — JLCPCB will consolidate shipping if ordered within same account.
