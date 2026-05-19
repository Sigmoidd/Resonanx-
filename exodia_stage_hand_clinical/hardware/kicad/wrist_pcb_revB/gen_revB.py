import uuid

def u():
    return str(uuid.uuid4())

sch = f"""(kicad_sch (version 20231120) (generator "kicad_sch")
  (uuid "{u()}")
  (paper "A4")
  (title_block
    (title "Exodia Stage Hand - Clinical Wrist PCB (Rev B)")
    (date "2026-05-18")
    (rev "Rev B")
    (company "Resonanx")
  )
  (lib_symbols
    (symbol "ESP32S3_MODULE" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 10 0) (effects (font (size 1.27 1.27))))
      (property "Value" "ESP32-S2-MINI-1" (id 1) (at 0 -12 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "ESP32S3_MODULE_0_1"
        (rectangle (start -10.16 -15.24) (end 10.16 10.16) (stroke (width 0) (type default)) (fill (type background)))
        (pin output line (at -15.24 5.08 0) (length 5.08) (name "PWM_HEATER") (number "25"))
        (pin passive line (at -15.24 2.54 0) (length 5.08) (name "ADC_NTC") (number "8"))
        (pin output line (at -15.24 0 0) (length 5.08) (name "MUX_S0") (number "21"))
        (pin output line (at -15.24 -2.54 0) (length 5.08) (name "MUX_S1") (number "22"))
        (pin output line (at -15.24 -5.08 0) (length 5.08) (name "DRV_EN") (number "23"))
        (pin output line (at -15.24 -7.62 0) (length 5.08) (name "DRV_TRIG") (number "24"))
        (pin bidirectional line (at -15.24 -10.16 0) (length 5.08) (name "I2C_SCL") (number "3"))
        (pin bidirectional line (at -15.24 -12.7 0) (length 5.08) (name "I2C_SDA") (number "4"))
        (pin passive line (at 15.24 5.08 180) (length 5.08) (name "ADC_EMG") (number "20"))
        (pin bidirectional line (at 15.24 -2.54 180) (length 5.08) (name "USB_D-") (number "26"))
        (pin bidirectional line (at 15.24 -5.08 180) (length 5.08) (name "USB_D+") (number "27"))
        (pin power_in line (at 15.24 2.54 180) (length 5.08) (name "3V3") (number "2"))
        (pin power_in line (at 15.24 0 180) (length 5.08) (name "GND") (number "1"))
      )
    )
    (symbol "TP4056_IC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "TP4056" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "TP4056_IC_0_1"
        (rectangle (start -5.08 -5.08) (end 5.08 5.08) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at -10.16 2.54 0) (length 5.08) (name "VIN") (number "4"))
        (pin passive line (at -10.16 -2.54 0) (length 5.08) (name "BAT+") (number "5"))
        (pin passive line (at 10.16 2.54 180) (length 5.08) (name "BAT-") (number "3"))
        (pin passive line (at 10.16 -2.54 180) (length 5.08) (name "GND") (number "3"))
      )
    )
    (symbol "AP2112K" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "AP2112K-3.3" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "AP2112K_0_1"
        (rectangle (start -5.08 -5.08) (end 5.08 5.08) (stroke (width 0) (type default)) (fill (type background)))
        (pin power_in line (at -10.16 2.54 0) (length 5.08) (name "VIN") (number "1"))
        (pin input line (at -10.16 -2.54 0) (length 5.08) (name "EN") (number "3"))
        (pin power_in line (at 0 -10.16 90) (length 5.08) (name "GND") (number "2"))
        (pin power_out line (at 10.16 2.54 180) (length 5.08) (name "VOUT") (number "5"))
      )
    )
    (symbol "DRV2605L_IC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 8 0) (effects (font (size 1.27 1.27))))
      (property "Value" "DRV2605L" (id 1) (at 0 -8 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "DRV2605L_IC_0_1"
        (rectangle (start -7.62 -7.62) (end 7.62 7.62) (stroke (width 0) (type default)) (fill (type background)))
        (pin power_in line (at -12.7 5.08 0) (length 5.08) (name "VDD") (number "10"))
        (pin input line (at -12.7 2.54 0) (length 5.08) (name "EN") (number "5"))
        (pin input line (at -12.7 0 0) (length 5.08) (name "SCL") (number "2"))
        (pin bidirectional line (at -12.7 -2.54 0) (length 5.08) (name "SDA") (number "3"))
        (pin input line (at -12.7 -5.08 0) (length 5.08) (name "IN/TRIG") (number "4"))
        (pin power_in line (at 12.7 -5.08 180) (length 5.08) (name "GND") (number "8"))
        (pin passive line (at 12.7 -2.54 180) (length 5.08) (name "REG") (number "1"))
        (pin power_out line (at 12.7 2.54 180) (length 5.08) (name "OUT+") (number "7"))
        (pin power_out line (at 12.7 0 180) (length 5.08) (name "OUT-") (number "9"))
      )
    )
    (symbol "TS3A5017_IC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 10 0) (effects (font (size 1.27 1.27))))
      (property "Value" "TS3A5017" (id 1) (at 0 -12 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "TS3A5017_IC_0_1"
        (rectangle (start -10.16 -15.24) (end 10.16 12.7) (stroke (width 0) (type default)) (fill (type background)))
        (pin power_in line (at -15.24 10.16 0) (length 5.08) (name "VCC") (number "16"))
        (pin input line (at -15.24 7.62 0) (length 5.08) (name "1OE") (number "7"))
        (pin input line (at -15.24 5.08 0) (length 5.08) (name "2OE") (number "9"))
        (pin input line (at -15.24 0 0) (length 5.08) (name "S1") (number "1"))
        (pin input line (at -15.24 -2.54 0) (length 5.08) (name "S0") (number "15"))
        (pin power_in line (at -15.24 -10.16 0) (length 5.08) (name "GND") (number "8"))
        
        (pin passive line (at 15.24 10.16 180) (length 5.08) (name "1COM") (number "6"))
        (pin passive line (at 15.24 7.62 180) (length 5.08) (name "1NO0") (number "2"))
        (pin passive line (at 15.24 5.08 180) (length 5.08) (name "1NO1") (number "3"))
        (pin passive line (at 15.24 2.54 180) (length 5.08) (name "1NO2") (number "4"))
        (pin passive line (at 15.24 0 180) (length 5.08) (name "1NO3") (number "5"))
        
        (pin passive line (at 15.24 -2.54 180) (length 5.08) (name "2COM") (number "10"))
        (pin passive line (at 15.24 -5.08 180) (length 5.08) (name "2NO0") (number "14"))
        (pin passive line (at 15.24 -7.62 180) (length 5.08) (name "2NO1") (number "13"))
        (pin passive line (at 15.24 -10.16 180) (length 5.08) (name "2NO2") (number "12"))
        (pin passive line (at 15.24 -12.7 180) (length 5.08) (name "2NO3") (number "11"))
      )
    )
    (symbol "AO3400A" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "Q" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "AO3400A" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "AO3400A_0_1"
        (rectangle (start -2.54 -2.54) (end 2.54 2.54) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -7.62 0 0) (length 5.08) (name "G") (number "1"))
        (pin passive line (at 7.62 2.54 180) (length 5.08) (name "D") (number "3"))
        (pin passive line (at 7.62 -2.54 180) (length 5.08) (name "S") (number "2"))
      )
    )
    (symbol "RESISTOR" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "R" (id 0) (at 0 2 0) (effects (font (size 1.27 1.27))))
      (property "Value" "R" (id 1) (at 0 -2 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "RESISTOR_0_1"
        (rectangle (start -1.27 -2.54) (end 1.27 2.54) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at 0 -7.62 90) (length 5.08) (name "1") (number "1"))
        (pin passive line (at 0 7.62 270) (length 5.08) (name "2") (number "2"))
      )
    )
    (symbol "NTC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "RT" (id 0) (at 0 3 0) (effects (font (size 1.27 1.27))))
      (property "Value" "NTC" (id 1) (at 0 -3 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "NTC_0_1"
        (rectangle (start -1.27 -2.54) (end 1.27 2.54) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at 0 -7.62 90) (length 5.08) (name "1") (number "1"))
        (pin passive line (at 0 7.62 270) (length 5.08) (name "2") (number "2"))
      )
    )
    (symbol "USBC_16PIN" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "J" (id 0) (at 0 7 0) (effects (font (size 1.27 1.27))))
      (property "Value" "USBC_16PIN" (id 1) (at 0 -7 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "USBC_16PIN_0_1"
        (rectangle (start -2.54 -5.08) (end 2.54 5.08) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at -7.62 5.08 0) (length 5.08) (name "VBUS") (number "A4"))
        (pin passive line (at -7.62 2.54 0) (length 5.08) (name "VBUS") (number "B9"))
        (pin passive line (at -7.62 0 0) (length 5.08) (name "VBUS") (number "A9"))
        (pin passive line (at -7.62 -2.54 0) (length 5.08) (name "VBUS") (number "B4"))
        
        (pin passive line (at 7.62 5.08 180) (length 5.08) (name "GND") (number "A1"))
        (pin passive line (at 7.62 2.54 180) (length 5.08) (name "GND") (number "B12"))
        (pin passive line (at 7.62 0 180) (length 5.08) (name "GND") (number "A12"))
        (pin passive line (at 7.62 -2.54 180) (length 5.08) (name "GND") (number "B1"))
        (pin passive line (at 7.62 -5.08 180) (length 5.08) (name "SHIELD") (number "SH"))
        
        (pin passive line (at -2.54 -10.16 90) (length 5.08) (name "CC1") (number "A5"))
        (pin passive line (at 2.54 -10.16 90) (length 5.08) (name "CC2") (number "B5"))
        (pin passive line (at -2.54 10.16 270) (length 5.08) (name "D+") (number "A6"))
        (pin passive line (at 2.54 10.16 270) (length 5.08) (name "D-") (number "A7"))
      )
    )
    (symbol "ZIF_10PIN" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "J" (id 0) (at 0 11 0) (effects (font (size 1.27 1.27))))
      (property "Value" "FLEX_HARNESS_10" (id 1) (at 0 -14 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "ZIF_10PIN_0_1"
        (rectangle (start -5.08 -15.24) (end 5.08 12.7) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at -10.16 10.16 0) (length 5.08) (name "HEAT_V+") (number "1"))
        (pin passive line (at -10.16 7.62 0) (length 5.08) (name "HEAT_GND") (number "2"))
        (pin passive line (at -10.16 5.08 0) (length 5.08) (name "IDX+") (number "3"))
        (pin passive line (at -10.16 2.54 0) (length 5.08) (name "IDX-") (number "4"))
        (pin passive line (at -10.16 0 0) (length 5.08) (name "MID+") (number "5"))
        (pin passive line (at -10.16 -2.54 0) (length 5.08) (name "MID-") (number "6"))
        (pin passive line (at -10.16 -5.08 0) (length 5.08) (name "RNG+") (number "7"))
        (pin passive line (at -10.16 -7.62 0) (length 5.08) (name "RNG-") (number "8"))
        (pin passive line (at -10.16 -10.16 0) (length 5.08) (name "PNK+") (number "9"))
        (pin passive line (at -10.16 -12.7 0) (length 5.08) (name "PNK-") (number "10"))
      )
    )
    (symbol "CAPACITOR" (pin_names (hide yes)) (in_bom yes) (on_board yes)
      (property "Reference" "C" (id 0) (at 2.54 2.54 0) (effects (font (size 1.27 1.27)) (justify left)))
      (property "Value" "C" (id 1) (at 2.54 0 0) (effects (font (size 1.27 1.27)) (justify left)))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "CAPACITOR_0_1"
        (polyline (pts (xy -2.032 -0.762) (xy 2.032 -0.762)) (stroke (width 0.254) (type default)) (fill (type none)))
        (polyline (pts (xy -2.032 0.762) (xy 2.032 0.762)) (stroke (width 0.254) (type default)) (fill (type none)))
        (pin passive line (at 0 5.08 270) (length 4.318) (name "1") (number "1"))
        (pin passive line (at 0 -5.08 90) (length 4.318) (name "2") (number "2"))
      )
    )
    (symbol "PWR_FLAG" (in_bom yes) (on_board yes)
      (property "Reference" "#FLG" (id 0) (at 0 2 0) (effects (hide yes)))
      (property "Value" "PWR_FLAG" (id 1) (at 0 -2 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "PWR_FLAG_0_1"
        (pin power_out line (at 0 -2.54 90) (length 2.54) (name "PWR") (number "1"))
        (polyline (pts (xy -1.27 -1.27) (xy 0 0) (xy 1.27 -1.27)) (stroke (width 0) (type default)) (fill (type none)))
      )
    )
  )
"""

components = [
    ("U1", "ESP32S3_MODULE", 152.4, 76.2),
    ("U2", "TP4056_IC", 50.8, 76.2),
    ("U3", "AP2112K", 91.44, 76.2),          # 3.3V LDO
    ("U4", "DRV2605L_IC", 152.4, 167.64),     # Haptic Driver (VSSOP-10)
    ("U5", "TS3A5017_IC", 203.2, 167.64),     # Dual 4:1 Mux (TSSOP-16)
    
    ("J1", "USBC_16PIN", 20.32, 76.2),
    ("J2", "ZIF_10PIN", 254.0, 137.16),       # 10-Pin ZIF harness
    ("Q1", "AO3400A", 172.72, 137.16),       # Heater Switching MOSFET
    
    ("R1", "RESISTOR", 101.6, 137.16, "10K"),     # NTC divider fixed resistor
    ("R2", "RESISTOR", 152.4, 137.16, "100"),     # Gate resistor Q1
    ("R3", "RESISTOR", 162.56, 147.32, "100K"),   # Pull-down Q1
    ("R4", "RESISTOR", 20.32, 96.52, "5.1K"),     # CC1 pulldown
    ("R5", "RESISTOR", 30.48, 96.52, "5.1K"),     # CC2 pulldown
    ("R6", "RESISTOR", 132.08, 116.84, "4.7K"),   # SDA Pullup
    ("R7", "RESISTOR", 142.24, 116.84, "4.7K"),   # SCL Pullup
    ("RT1", "NTC", 101.6, 157.48, "NTC"),         # Thermistor
    
    ("C1", "CAPACITOR", 60.96, 96.52, "10uF"),    # VBUS dec
    ("C2", "CAPACITOR", 71.12, 96.52, "10uF"),    # BAT+ dec
    ("C3", "CAPACITOR", 81.28, 96.52, "1uF"),     # LDO In dec
    ("C4", "CAPACITOR", 91.44, 96.52, "1uF"),     # LDO Out dec
    ("C5", "CAPACITOR", 132.08, 35.56, "10uF"),   # ESP32 3V3 dec
    ("C6", "CAPACITOR", 142.24, 35.56, "0.1uF"),  # ESP32 3V3 dec
    ("C7", "CAPACITOR", 152.4, 198.12, "0.1uF"),   # DRV2605 REG cap
    ("C8", "CAPACITOR", 162.56, 198.12, "1uF"),    # DRV2605 VDD dec
    ("C9", "CAPACITOR", 203.2, 198.12, "0.1uF"),   # Mux VCC dec

    ("#FLG1", "PWR_FLAG", 101.6, 55.88, "PWR_FLAG"),  # 3V3 flag
    ("#FLG2", "PWR_FLAG", 81.28, 66.04, "PWR_FLAG"),  # GND flag
]

footprints = {
    "U1": "RF_Module:ESP32-S2-MINI-1",
    "U2": "Package_SO:SOIC-8-1EP_3.9x4.9mm_P1.27mm_EP2.29x3mm_ThermalVias",
    "U3": "Package_TO_SOT_SMD:SOT-23-5",
    "U4": "Package_SO:VSSOP-10_3.0x3.0mm_P0.5mm",
    "U5": "Package_SO:TSSOP-16_4.4x5mm_P0.65mm",
    "J1": "Connector_USB:USB_C_Receptacle_XKB_U262-16XN-4BVC11",
    "J2": "Connector_FFC-FPC:TE_1-1734839-0_1x10-1MP_P0.5mm_Horizontal",
    "Q1": "Package_TO_SOT_SMD:SOT-23-3",
    "R1": "Resistor_SMD:R_0603_1608Metric",
    "R2": "Resistor_SMD:R_0603_1608Metric",
    "R3": "Resistor_SMD:R_0603_1608Metric",
    "R4": "Resistor_SMD:R_0603_1608Metric",
    "R5": "Resistor_SMD:R_0603_1608Metric",
    "R6": "Resistor_SMD:R_0603_1608Metric",
    "R7": "Resistor_SMD:R_0603_1608Metric",
    "RT1": "Resistor_SMD:R_0603_1608Metric",
    "C1": "Capacitor_SMD:C_0603_1608Metric",
    "C2": "Capacitor_SMD:C_0603_1608Metric",
    "C3": "Capacitor_SMD:C_0603_1608Metric",
    "C4": "Capacitor_SMD:C_0603_1608Metric",
    "C5": "Capacitor_SMD:C_0603_1608Metric",
    "C6": "Capacitor_SMD:C_0603_1608Metric",
    "C7": "Capacitor_SMD:C_0603_1608Metric",
    "C8": "Capacitor_SMD:C_0603_1608Metric",
    "C9": "Capacitor_SMD:C_0603_1608Metric",
}

for item in components:
    ref = item[0]
    sym = item[1]
    x = item[2]
    y = item[3]
    val = item[4] if len(item) > 4 else sym
    fp = footprints.get(ref, "")
    sch += f"""
  (symbol (lib_id "{sym}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes)
    (uuid "{u()}")
    (property "Reference" "{ref}" (id 0) (at {x} {y-10.16} 0) (effects (font (size 1.27 1.27))))
    (property "Value" "{val}" (id 1) (at {x} {y+10.16} 0) (effects (font (size 1.27 1.27))))
    (property "Footprint" "{fp}" (id 2) (at {x} {y} 0) (effects (hide yes)))
    (property "Datasheet" "" (id 3) (at {x} {y} 0) (effects (hide yes)))
  )
"""

sch += f"""
  (text "POWER MANAGEMENT Rev B" (at 45.72 50.8 0) (effects (font (size 2 2)) (justify left)) (uuid "{u()}"))
  (text "MAIN BRAIN (ESP32-S2)" (at 132.08 55.88 0) (effects (font (size 2 2)) (justify left)) (uuid "{u()}"))
  (text "HEATER MOSFET" (at 162.56 127 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
  (text "HAPTIC DRIVER & SWITCHING MUX" (at 142.24 154.94 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
"""

def add_label(text, x, y, rot=0):
    global sch
    sch += f"""
  (label "{text}" (at {x} {y} {rot}) (effects (font (size 1.27 1.27)) (justify left bottom)) (uuid "{u()}"))
"""

# J1 USB-C (16-pin)
add_label("VBUS", 20.32-7.62, 76.2-5.08, 180)
add_label("VBUS", 20.32-7.62, 76.2-2.54, 180)
add_label("VBUS", 20.32-7.62, 76.2, 180)
add_label("VBUS", 20.32-7.62, 76.2+2.54, 180)

add_label("GND", 20.32+7.62, 76.2-5.08, 0)
add_label("GND", 20.32+7.62, 76.2-2.54, 0)
add_label("GND", 20.32+7.62, 76.2, 0)
add_label("GND", 20.32+7.62, 76.2+2.54, 0)
add_label("GND", 20.32+7.62, 76.2+5.08, 0)

add_label("NET_CC1", 20.32-2.54, 76.2+10.16, 270)
add_label("NET_CC2", 20.32+2.54, 76.2+10.16, 270)
add_label("USB_D+", 20.32-2.54, 76.2-10.16, 90)
add_label("USB_D-", 20.32+2.54, 76.2-10.16, 90)

# CC Resistors
add_label("NET_CC1", 20.32, 96.52-7.62, 90)
add_label("GND", 20.32, 96.52+7.62, 270)
add_label("NET_CC2", 30.48, 96.52-7.62, 90)
add_label("GND", 30.48, 96.52+7.62, 270)

# U2 TP4056
add_label("VBUS", 50.8-10.16, 76.2-2.54, 180)
add_label("GND", 50.8+10.16, 76.2+2.54, 0)
add_label("BAT+", 50.8-10.16, 76.2+2.54, 180)
add_label("GND", 50.8+10.16, 76.2-2.54, 0)

# U3 LDO (AP2112K-3.3)
add_label("BAT+", 91.44-10.16, 76.2-2.54, 180) # VIN
add_label("BAT+", 91.44-10.16, 76.2+2.54, 180) # EN tied to VIN
add_label("GND", 91.44, 76.2+10.16, 270)       # GND
add_label("3V3", 91.44+10.16, 76.2-2.54, 0)    # VOUT

# U1 ESP32
add_label("PWM_HEATER", 152.4-15.24, 76.2-5.08, 180)
add_label("ADC_NTC", 152.4-15.24, 76.2-2.54, 180)
add_label("MUX_S0", 152.4-15.24, 76.2, 180)
add_label("MUX_S1", 152.4-15.24, 76.2+2.54, 180)
add_label("DRV_EN", 152.4-15.24, 76.2+5.08, 180)
add_label("DRV_TRIG", 152.4-15.24, 76.2+7.62, 180)
add_label("I2C_SCL", 152.4-15.24, 76.2+10.16, 180)
add_label("I2C_SDA", 152.4-15.24, 76.2+12.7, 180)
add_label("ADC_EMG", 152.4+15.24, 76.2-5.08, 0)
add_label("USB_D-", 152.4+15.24, 76.2+2.54, 0)
add_label("USB_D+", 152.4+15.24, 76.2+5.08, 0)
add_label("3V3", 152.4+15.24, 76.2-2.54, 0)
add_label("GND", 152.4+15.24, 76.2, 0)

# Gate Resistor R2 & Q1
add_label("PWM_HEATER", 152.4, 137.16-7.62, 90)
add_label("GATE_HEAT", 152.4, 137.16+7.62, 270)
add_label("GATE_HEAT", 172.72-7.62, 137.16, 180)
add_label("GND", 172.72+7.62, 137.16+2.54, 0)
add_label("NET_HEAT", 172.72+7.62, 137.16-2.54, 0)

# Pulldown R3
add_label("GATE_HEAT", 162.56, 147.32-7.62, 90)
add_label("GND", 162.56, 147.32+7.62, 270)

# I2C Pullups
add_label("I2C_SDA", 132.08, 116.84-7.62, 90)
add_label("3V3", 132.08, 116.84+7.62, 270)
add_label("I2C_SCL", 142.24, 116.84-7.62, 90)
add_label("3V3", 142.24, 116.84+7.62, 270)

# U4 DRV2605L Haptic Driver
add_label("3V3", 152.4-12.7, 167.64-5.08, 180)      # VDD
add_label("DRV_EN", 152.4-12.7, 167.64-2.54, 180)   # EN
add_label("I2C_SCL", 152.4-12.7, 167.64, 180)       # SCL
add_label("I2C_SDA", 152.4-12.7, 167.64+2.54, 180)  # SDA
add_label("DRV_TRIG", 152.4-12.7, 167.64+5.08, 180) # IN/TRIG
add_label("GND", 152.4+12.7, 167.64+5.08, 0)        # GND
add_label("NET_DRV_REG", 152.4+12.7, 167.64+2.54, 0) # REG regulator cap
add_label("DRV_OUT+", 152.4+12.7, 167.64-2.54, 0)   # OUT+
add_label("DRV_OUT-", 152.4+12.7, 167.64, 0)        # OUT-

# U5 TS3A5017 Mux
add_label("3V3", 203.2-15.24, 167.64-10.16, 180)     # VCC
add_label("GND", 203.2-15.24, 167.64-7.62, 180)     # 1OE tied to GND
add_label("GND", 203.2-15.24, 167.64-5.08, 180)     # 2OE tied to GND
add_label("MUX_S1", 203.2-15.24, 167.64, 180)       # S1
add_label("MUX_S0", 203.2-15.24, 167.64+2.54, 180)  # S0
add_label("GND", 203.2-15.24, 167.64+10.16, 180)    # GND

add_label("DRV_OUT+", 203.2+15.24, 167.64-10.16, 0)  # 1COM
add_label("NET_M0_OUT+", 203.2+15.24, 167.64-7.62, 0) # 1NO0 -> Index Motor+
add_label("NET_M1_OUT+", 203.2+15.24, 167.64-5.08, 0) # 1NO1 -> Middle Motor+
add_label("NET_M2_OUT+", 203.2+15.24, 167.64-2.54, 0) # 1NO2 -> Ring Motor+
add_label("NET_M3_OUT+", 203.2+15.24, 167.64, 0)      # 1NO3 -> Pinky Motor+

add_label("DRV_OUT-", 203.2+15.24, 167.64+2.54, 0)   # 2COM
add_label("NET_M0_OUT-", 203.2+15.24, 167.64+5.08, 0) # 2NO0 -> Index Motor-
add_label("NET_M1_OUT-", 203.2+15.24, 167.64+7.62, 0) # 2NO1 -> Middle Motor-
add_label("NET_M2_OUT-", 203.2+15.24, 167.64+10.16, 0) # 2NO2 -> Ring Motor-
add_label("NET_M3_OUT-", 203.2+15.24, 167.64+12.7, 0) # 2NO3 -> Pinky Motor-

# NTC Divider
add_label("3V3", 101.6, 137.16-7.62, 90)
add_label("ADC_NTC", 101.6, 137.16+7.62, 270)
add_label("ADC_NTC", 101.6, 157.48-7.62, 90)
add_label("GND", 101.6, 157.48+7.62, 270)

# ZIF J2 (10-pin)
add_label("BAT+", 254.0-10.16, 137.16-10.16, 180)  # Pin 1: HEAT_V+
add_label("NET_HEAT", 254.0-10.16, 137.16-7.62, 180) # Pin 2: HEAT_GND
add_label("NET_M0_OUT+", 254.0-10.16, 137.16-5.08, 180) # Pin 3: IDX+
add_label("NET_M0_OUT-", 254.0-10.16, 137.16-2.54, 180) # Pin 4: IDX-
add_label("NET_M1_OUT+", 254.0-10.16, 137.16, 180)      # Pin 5: MID+
add_label("NET_M1_OUT-", 254.0-10.16, 137.16+2.54, 180) # Pin 6: MID-
add_label("NET_M2_OUT+", 254.0-10.16, 137.16+5.08, 180) # Pin 7: RNG+
add_label("NET_M2_OUT-", 254.0-10.16, 137.16+7.62, 180) # Pin 8: RNG-
add_label("NET_M3_OUT+", 254.0-10.16, 137.16+10.16, 180) # Pin 9: PNK+
add_label("NET_M3_OUT-", 254.0-10.16, 137.16+12.7, 180)  # Pin 10: PNK-

# Capacitors
add_label("VBUS", 60.96, 96.52-7.62, 90)
add_label("GND", 60.96, 96.52+7.62, 270)

add_label("BAT+", 71.12, 96.52-7.62, 90)
add_label("GND", 71.12, 96.52+7.62, 270)

add_label("BAT+", 81.28, 96.52-7.62, 90)
add_label("GND", 81.28, 96.52+7.62, 270)

add_label("3V3", 91.44, 96.52-7.62, 90)
add_label("GND", 91.44, 96.52+7.62, 270)

add_label("3V3", 132.08, 35.56-7.62, 90)
add_label("GND", 132.08, 35.56+7.62, 270)

add_label("3V3", 142.24, 35.56-7.62, 90)
add_label("GND", 142.24, 35.56+7.62, 270)

# DRV2605L Caps C7, C8
add_label("NET_DRV_REG", 152.4, 198.12-7.62, 90)
add_label("GND", 152.4, 198.12+7.62, 270)

add_label("3V3", 162.56, 198.12-7.62, 90)
add_label("GND", 162.56, 198.12+7.62, 270)

# Mux Cap C9
add_label("3V3", 203.2, 198.12-7.62, 90)
add_label("GND", 203.2, 198.12+7.62, 270)

# PWR FLAGs
add_label("3V3", 101.6, 55.88+2.54, 0)
add_label("GND", 81.28, 66.04+2.54, 0)

sch += ")\n"

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb_revB/wrist_pcb_revB.kicad_sch", "w") as f:
    f.write(sch)

print("Generated Clinical Rev B Schematic with DRV2605L haptic driver and TS3A5017 multiplexer!")
