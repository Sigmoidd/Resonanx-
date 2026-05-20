# Exodia Stage Hand Care Edition — Bill of Materials & Manufacturing Guide (Rev B)

> **First run cost: ~$165–$195 total for 5 units (~$33–39 per unit)**
> Fully sealed. No exposed metal. Safe and comfortable for memory care deployment.

---

## Part 1: PCB & Flex Harness Fabrication (order once, covers 5 units)

| # | Item | Qty | Est. Cost | Source | Notes |
|---|------|-----|-----------|--------|-------|
| 1 | **Rigid Controller PCB** (2-layer FR4, 45×35mm) | 5 | ~$5 | [JLCPCB](https://jlcpcb.com) | Standard 2-layer FR4. Upload Gerbers. |
| 2 | **Flex Glove Harness** (1-layer polyimide, custom, 20-pin) | 5 | ~$28 | [JLCPCB Flex](https://jlcpcb.com/pcb-assembly) | 1-layer polyimide flex pool. Coverlay both sides. 0.1mm substrate thickness. |
| 3 | **Laser solder stencil** (for rigid PCB) | 1 | ~$10 | [JLCPCB](https://jlcpcb.com) | Required for precise SMD solder paste application. |

**Fabrication subtotal: ~$43**

---

## Part 2: SMD Board Components (per 5-unit batch)

| # | Component | Qty (×5) | Est. Cost | Source | Notes |
|---|-----------|----------|-----------|--------|-------|
| 1 | **ESP32-S3 module** (SMD, ESP32-S3-MINI-1) | 5 | ~$20 | [LCSC](https://www.lcsc.com) / [DigiKey](https://www.digikey.com) | SMD module with castellated pads. 8MB flash. |
| 2 | **TP4056 IC** (SOP-8 or SOT-23-8) | 5 | ~$3 | [LCSC](https://www.lcsc.com) | LiPo charging regulator IC. |
| 3 | **AP2112K-3.3 LDO Regulator** (SOT-23-5) | 5 | ~$2 | [LCSC](https://www.lcsc.com) | High-performance 3.3V LDO for stable analog & brain power. |
| 4 | **DRV2605L Haptic Driver IC** (VSSOP-10) | 15 | ~$22 | [DigiKey](https://www.digikey.com) / [LCSC](https://www.lcsc.com) | Three dedicated drivers per unit (Low, Mid, High LRA). |
| 5 | **TS3A5017 Dual 4:1 Mux** (TSSOP-16) | 5 | ~$6 | [DigiKey](https://www.digikey.com) / [LCSC](https://www.lcsc.com) | Analog multiplexer for low-current sensors routing. |
| 6 | **AO3400A N-ch MOSFET** (SOT-23) | 5 | ~$1 | [LCSC](https://www.lcsc.com) | Heater ground-side switching transistor. |
| 7 | **10K & 100K resistors** 0603 | 25 | ~$2 | [LCSC](https://www.lcsc.com) | Pull-downs, I2C pull-ups, and NTC dividers. |
| 8 | **10uF & 1uF bypass caps** 0603 | 20 | ~$2 | [LCSC](https://www.lcsc.com) | Power rail decoupling capacitors. |
| 9 | **USB-C connector** (16-pin, SMD) | 5 | ~$4 | [LCSC](https://www.lcsc.com) | Receptacle for charge power input. |
| 10| **ZIF FPC connector** (20-pin, 0.5mm, SMD) | 5 | ~$5 | [LCSC](https://www.lcsc.com) | Glove-to-PCB ribbon interface. |
| 11| **SPDT Slide switch** (SMD) | 5 | ~$2 | [LCSC](https://www.lcsc.com) | Physical battery power cut. |
| 12| **SK6812/WS2812B RGB LED** (SMD) | 5 | ~$1 | [LCSC](https://www.lcsc.com) | System status light on controller PCB. |

**SMD subtotal: ~$70**

---

## Part 3: Glove-Side Wearable Components (per 5-unit batch)

| # | Component | Qty | Est. Cost | Source | Notes |
|---|-----------|-----|-----------|--------|-------|
| 1 | **EeonTex NW170-PI-20 fabric** | 2 sheets | ~$40 | [Adafruit #3670](https://www.adafruit.com/product/3670) | Conductive fabric sheets for glove heater zones. |
| 2 | **8mm 0820 coin vibration LRAs** | 1 pack (15) | ~$12 | [Amazon](https://www.amazon.com) | 3 per unit (Index, Middle, Ring backs). |
| 3 | **WS2812B-Mini or SK6812-EC15 LEDs** | 1 pack (25) | ~$10 | [Amazon](https://www.amazon.com) | 5 per unit (finger backs) on the flex harness. |
| 4 | **10K NTC thermistors** (waterproof sleeve) | 5 | ~$5 | [Amazon](https://www.amazon.com) | Direct temperature sensor sewn near player's skin. |
| 5 | **LiPo 1000mAh Flat Battery** (3.7V) | 5 | ~$30 | [Adafruit #2011](https://www.adafruit.com/product/2011) | Sleek battery fitting inside the TPU wristband casing. |
| 6 | **Soft Compression Gloves** (fingerless) | 5 | ~$30 | [Amazon](https://www.amazon.com) | Comfortable textile base for player. |

**Wearable subtotal: ~$127**

---

## Part 4: Assembly & Sealing Materials (shared across batch)

| # | Component | Qty | Est. Cost | Source | Notes |
|---|-----------|-----|-----------|--------|-------|
| 1 | **3M 9485PC Medical Transfer Tape** | 1 roll | ~$15 | [Amazon](https://www.amazon.com) | Double-sided skin-safe adhesive for polyimide flex mounting. |
| 2 | **MG Chemicals 422B Conformal Coat** | 1 can | ~$20 | [Amazon](https://www.amazon.com) | Silicone conformal coating to fully seal components and junctions. |
| 3 | **TPU filament** (soft/flexible) | 250g | ~$15 | [Amazon](https://www.amazon.com) | Filament for printing rounded wristband cases. |

**Safety subtotal: ~$50**

---

## Batch Cost Summary (5 Units)

| Segment | Total Cost |
|---------|------------|
| PCB & Flex harness fabrication | ~$43 |
| SMD board components | ~$70 |
| Glove wearables & sensors | ~$127 |
| Sealing & casing materials | ~$50 |
| **Total for 5 units** | **~$290** |
| **Per-unit cost** | **~$58** |

*Note: Runs 2+ drop to ~$35/unit as shared safety and sealing materials carry forward.*

---

## Manufacturing Flow

1. **PCB & Harness Order:** Upload rigid and flex design files to JLCPCB. Select stencil and consolidated components from LCSC.
2. **Wearables & Sensors Sourcing:** Secure compression gloves, 8mm LRA motors, addressable LEDs, waterproof thermistors, and flat LiPo batteries.
3. **Board Reflow:** Apply paste using the stencil and reflow the controller board. Inspect the three DRV2605L chips and ESP32-S3 module carefully for bridging.
4. **Harness Bond:** Cut and clean the glove fabric. Secure the 20-pin flex harness inside the glove lining using the 3M medical adhesive tape. Solder the LRA motors, LEDs, and thermistor to their designated flex pads.
5. **Ground Routing Check:** Verify that the high-current `HEAT_RETURN` lines and sensitive `ANALOG_GND` lines are isolated all the way to the controller board star-ground point.
6. **Program and Coat:** Flash test firmware over USB-C. Once functioning, paint all board components and glove solder pads with the conformal coating and let cure.
7. **Final Casing:** Place the controller board and battery into the printed soft TPU enclosure, lock the 20-pin ZIF in place, and slide the casing onto the glove cuff.
