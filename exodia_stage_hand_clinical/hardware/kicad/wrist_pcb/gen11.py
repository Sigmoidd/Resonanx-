import uuid

def u():
    return str(uuid.uuid4())

sch = f"""(kicad_sch (version 20231120) (generator "kicad_sch")
  (uuid "{u()}")
  (paper "A4")
  (title_block
    (title "Exodia Stage Hand - Clinical Wrist PCB")
    (date "2026-05-16")
    (rev "v1.9")
    (company "Resonanx")
  )
  (lib_symbols
    (symbol "ESP32S3_MODULE" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 8 0) (effects (font (size 1.27 1.27))))
      (property "Value" "ESP32-S3-MINI-1" (id 1) (at 0 -8 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "ESP32S3_MODULE_0_1"
        (rectangle (start -10.16 -10.16) (end 10.16 10.16) (stroke (width 0) (type default)) (fill (type background)))
        (pin output line (at -15.24 5.08 0) (length 5.08) (name "PWM_HEATER") (number "25"))
        (pin passive line (at -15.24 2.54 0) (length 5.08) (name "ADC_NTC") (number "8"))
        (pin output line (at -15.24 0 0) (length 5.08) (name "PWM_M_IDX") (number "21"))
        (pin output line (at -15.24 -2.54 0) (length 5.08) (name "PWM_M_MID") (number "22"))
        (pin output line (at -15.24 -5.08 0) (length 5.08) (name "PWM_M_RNG") (number "23"))
        (pin output line (at -15.24 -7.62 0) (length 5.08) (name "PWM_M_PNK") (number "24"))
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
    (symbol "2N7002" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "Q" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "2N7002" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "2N7002_0_1"
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
    (symbol "ZIF_5PIN" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "J" (id 0) (at 0 6 0) (effects (font (size 1.27 1.27))))
      (property "Value" "FLEX_HARNESS" (id 1) (at 0 -6 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "ZIF_5PIN_0_1"
        (rectangle (start -5.08 -5.08) (end 5.08 7.62) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at -10.16 5.08 0) (length 5.08) (name "V+") (number "1"))
        (pin passive line (at -10.16 2.54 0) (length 5.08) (name "HEAT_GND") (number "2"))
        (pin passive line (at -10.16 0 0) (length 5.08) (name "M_IDX_GND") (number "3"))
        (pin passive line (at -10.16 -2.54 0) (length 5.08) (name "M_MID_GND") (number "4"))
        (pin passive line (at -10.16 -5.08 0) (length 5.08) (name "M_RNG_PNK") (number "5"))
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
    ("J1", "USBC_16PIN", 20.32, 76.2),
    ("J2", "ZIF_5PIN", 233.68, 137.16),
    ("Q1", "AO3400A", 172.72, 137.16),
    ("Q2", "2N7002", 132.08, 167.64),
    ("Q3", "2N7002", 152.4, 167.64),
    ("Q4", "2N7002", 172.72, 167.64),
    ("Q5", "2N7002", 193.04, 167.64),
    ("R1", "RESISTOR", 101.6, 137.16, "10K"),     # NTC divider
    ("R2", "RESISTOR", 152.4, 137.16, "100"),     # Gate resistor Q1
    ("R3", "RESISTOR", 162.56, 147.32, "100K"),   # Pull-down Q1
    ("R4", "RESISTOR", 20.32, 96.52, "5.1K"),     # CC1 pulldown
    ("R5", "RESISTOR", 30.48, 96.52, "5.1K"),     # CC2 pulldown
    ("RT1", "NTC", 101.6, 157.48, "NTC"),
    
    ("C1", "CAPACITOR", 60.96, 96.52, "10uF"),
    ("C2", "CAPACITOR", 71.12, 96.52, "10uF"),
    ("C3", "CAPACITOR", 81.28, 96.52, "1uF"),
    ("C4", "CAPACITOR", 91.44, 96.52, "1uF"),
    ("C5", "CAPACITOR", 132.08, 35.56, "10uF"),
    ("C6", "CAPACITOR", 142.24, 35.56, "0.1uF"),

    ("#FLG1", "PWR_FLAG", 101.6, 55.88, "PWR_FLAG"),  # 3V3 flag
    ("#FLG2", "PWR_FLAG", 81.28, 66.04, "PWR_FLAG"),  # GND flag
]

for item in components:
    ref = item[0]
    sym = item[1]
    x = item[2]
    y = item[3]
    val = item[4] if len(item) > 4 else sym
    sch += f"""
  (symbol (lib_id "{sym}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes)
    (uuid "{u()}")
    (property "Reference" "{ref}" (id 0) (at {x} {y-10.16} 0) (effects (font (size 1.27 1.27))))
    (property "Value" "{val}" (id 1) (at {x} {y+10.16} 0) (effects (font (size 1.27 1.27))))
    (property "Footprint" "" (id 2) (at {x} {y} 0) (effects (hide yes)))
    (property "Datasheet" "" (id 3) (at {x} {y} 0) (effects (hide yes)))
  )
"""

sch += f"""
  (text "POWER MANAGEMENT v1.9" (at 45.72 50.8 0) (effects (font (size 2 2)) (justify left)) (uuid "{u()}"))
  (text "MAIN BRAIN (ESP32-S3)" (at 132.08 60.96 0) (effects (font (size 2 2)) (justify left)) (uuid "{u()}"))
  (text "HEATER MOSFET" (at 162.56 127 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
  (text "MOTOR MOSFETs" (at 142.24 154.94 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
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
add_label("PWM_M_IDX", 152.4-15.24, 76.2, 180)
add_label("PWM_M_MID", 152.4-15.24, 76.2+2.54, 180)
add_label("PWM_M_RNG", 152.4-15.24, 76.2+5.08, 180)
add_label("PWM_M_PNK", 152.4-15.24, 76.2+7.62, 180)
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

# Motors
add_label("PWM_M_IDX", 132.08-7.62, 167.64, 180)
add_label("GND", 132.08+7.62, 167.64+2.54, 0)
add_label("NET_M_IDX", 132.08+7.62, 167.64-2.54, 0)

add_label("PWM_M_MID", 152.4-7.62, 167.64, 180)
add_label("GND", 152.4+7.62, 167.64+2.54, 0)
add_label("NET_M_MID", 152.4+7.62, 167.64-2.54, 0)

add_label("PWM_M_RNG", 172.72-7.62, 167.64, 180)
add_label("GND", 172.72+7.62, 167.64+2.54, 0)
add_label("NET_M_RNG_PNK", 172.72+7.62, 167.64-2.54, 0)

add_label("PWM_M_PNK", 193.04-7.62, 167.64, 180)
add_label("GND", 193.04+7.62, 167.64+2.54, 0)
add_label("NET_M_RNG_PNK", 193.04+7.62, 167.64-2.54, 0)

# NTC Divider
add_label("3V3", 101.6, 137.16-7.62, 90)
add_label("ADC_NTC", 101.6, 137.16+7.62, 270)
add_label("ADC_NTC", 101.6, 157.48-7.62, 90)
add_label("GND", 101.6, 157.48+7.62, 270)

# ZIF J2
add_label("BAT+", 233.68-10.16, 137.16-5.08, 180)  # Powered directly from Battery!
add_label("NET_HEAT", 233.68-10.16, 137.16-2.54, 180)
add_label("NET_M_IDX", 233.68-10.16, 137.16, 180)
add_label("NET_M_MID", 233.68-10.16, 137.16+2.54, 180)
add_label("NET_M_RNG_PNK", 233.68-10.16, 137.16+5.08, 180)


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


# PWR FLAGs
add_label("3V3", 101.6, 55.88+2.54, 0)
add_label("GND", 81.28, 66.04+2.54, 0)

sch += ")\n"

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_sch", "w") as f:
    f.write(sch)

print("Generated Clinical v1.9 Schematic with all upgrades!")
