# Clinical Wrist PCB — Component Placement Checklist

To build the schematic in KiCad, open the `wrist_pcb.kicad_sch` file and place the following components. The schematic handles the core logic outlined in our clinical specification.

## Component Checklist

### 1. The Core Brain
- [ ] **U1: ESP32-S3-MINI-1** (Search: `ESP32-S3-MINI-1`)
  - The main microcontroller module.

### 2. Power Management
- [ ] **U2: TP4056** (Search: `TP4056`)
  - LiPo charge controller.
- [ ] **J1: USB_C_Receptacle** (Search: `USB_C_Receptacle_USB2.0`)
  - For 5V charge input. VBUS connects to TP4056 VIN.
- [ ] **SW1: SPDT Switch** (Search: `SW_SPDT`)
  - Place between TP4056 BAT+ output and the main VCC rail.

### 3. Heater Control
- [ ] **Q1: IRLZ44N MOSFET** (Search: `IRLZ44N`)
  - **Gate** connects to ESP32 GPIO4.
  - **Drain** connects to the ZIF connector (Heater GND pin).
  - **Source** connects to Ground.

### 4. Motor Control (Haptics)
- [ ] **Q2, Q3, Q4, Q5: 2N7002 MOSFETs** (Search: `2N7002`)
  - **Q2 Gate** -> GPIO6 (Index)
  - **Q3 Gate** -> GPIO7 (Middle)
  - **Q4 Gate** -> GPIO15 (Ring)
  - **Q5 Gate** -> GPIO16 (Pinky)
  - All **Sources** connect to Ground.
  - All **Drains** connect to their respective pins on the ZIF connector.

### 5. Safety Thermistor
- [ ] **R1: 10K Resistor** (Search: `R_Small`)
- [ ] **RT1: 10K NTC** (Search: `NTC`)
  - Wire as a voltage divider between VCC and GND.
  - The midpoint connects to ESP32 GPIO5 (ADC).

### 6. Flex Harness Interface
- [ ] **J2: ZIF Connector (5-Pin)** (Search: `Conn_01x05_Pin`)
  - Pin 1: V+ (Main VCC Rail)
  - Pin 2: Heater GND (to Q1 Drain)
  - Pin 3: Motor IDX GND (to Q2 Drain)
  - Pin 4: Motor MID GND (to Q3 Drain)
  - Pin 5: Motor RNG/PNK GND (to Q4/Q5 Drains)

## Next Steps
Once placed, run the ERC (Electrical Rules Checker) in KiCad to ensure all grounds and power pins are correctly connected before moving to the PCB Layout editor.
