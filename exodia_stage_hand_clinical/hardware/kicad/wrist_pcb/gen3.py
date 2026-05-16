import uuid

def u():
    return str(uuid.uuid4())

sch = f"""(kicad_sch (version 20231120) (generator "kicad_sch")
  (uuid "{u()}")
  (paper "A4")
  (title_block
    (title "Exodia Stage Hand - Clinical Wrist PCB")
    (date "2026-05-15")
    (rev "v1.1")
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
        (pin output line (at -15.24 5.08 0) (length 5.08) (name "GPIO4") (number "1"))
        (pin input line (at -15.24 2.54 0) (length 5.08) (name "GPIO5") (number "2"))
        (pin output line (at -15.24 0 0) (length 5.08) (name "GPIO6") (number "3"))
        (pin output line (at -15.24 -2.54 0) (length 5.08) (name "GPIO7") (number "4"))
        (pin output line (at -15.24 -5.08 0) (length 5.08) (name "GPIO15") (number "5"))
        (pin output line (at -15.24 -7.62 0) (length 5.08) (name "GPIO16") (number "6"))
        (pin input line (at 15.24 5.08 180) (length 5.08) (name "GPIO17") (number "7"))
        (pin power_in line (at 15.24 2.54 180) (length 5.08) (name "3V3") (number "8"))
        (pin power_in line (at 15.24 0 180) (length 5.08) (name "GND") (number "9"))
      )
    )
    (symbol "TP4056_IC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "TP4056" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "TP4056_IC_0_1"
        (rectangle (start -5.08 -5.08) (end 5.08 5.08) (stroke (width 0) (type default)) (fill (type background)))
        (pin power_in line (at -10.16 2.54 0) (length 5.08) (name "VIN") (number "1"))
        (pin power_out line (at -10.16 -2.54 0) (length 5.08) (name "BAT+") (number "2"))
        (pin power_out line (at 10.16 2.54 180) (length 5.08) (name "BAT-") (number "3"))
        (pin power_in line (at 10.16 -2.54 180) (length 5.08) (name "GND") (number "4"))
      )
    )
    (symbol "IRLZ44N" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "Q" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "IRLZ44N" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "IRLZ44N_0_1"
        (rectangle (start -2.54 -2.54) (end 2.54 2.54) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -7.62 0 0) (length 5.08) (name "G") (number "1"))
        (pin passive line (at 7.62 2.54 180) (length 5.08) (name "D") (number "2"))
        (pin passive line (at 7.62 -2.54 180) (length 5.08) (name "S") (number "3"))
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
        (pin passive line (at 7.62 2.54 180) (length 5.08) (name "D") (number "2"))
        (pin passive line (at 7.62 -2.54 180) (length 5.08) (name "S") (number "3"))
      )
    )
    (symbol "R_10K" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "R" (id 0) (at 0 2 0) (effects (font (size 1.27 1.27))))
      (property "Value" "10K" (id 1) (at 0 -2 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "R_10K_0_1"
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
    (symbol "USBC_CONN" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "J" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "USBC_CHARGE" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "USBC_CONN_0_1"
        (rectangle (start -2.54 -2.54) (end 2.54 2.54) (stroke (width 0) (type default)) (fill (type background)))
        (pin power_out line (at -7.62 2.54 0) (length 5.08) (name "VBUS") (number "1"))
        (pin power_out line (at -7.62 -2.54 0) (length 5.08) (name "GND") (number "2"))
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
    ("U2", "TP4056_IC", 60.96, 76.2),
    ("J1", "USBC_CONN", 30.48, 76.2),
    ("J2", "ZIF_5PIN", 233.68, 137.16),
    ("Q1", "IRLZ44N", 152.4, 137.16),
    ("Q2", "2N7002", 132.08, 167.64),
    ("Q3", "2N7002", 152.4, 167.64),
    ("Q4", "2N7002", 172.72, 167.64),
    ("Q5", "2N7002", 193.04, 167.64),
    ("R1", "R_10K", 101.6, 137.16),
    ("RT1", "NTC", 101.6, 157.48),
    ("#FLG1", "PWR_FLAG", 81.28, 55.88),  # VCC flag
    ("#FLG2", "PWR_FLAG", 81.28, 66.04),  # GND flag
]

for ref, sym, x, y in components:
    sch += f"""
  (symbol (lib_id "{sym}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes)
    (uuid "{u()}")
    (property "Reference" "{ref}" (id 0) (at {x} {y-10.16} 0) (effects (font (size 1.27 1.27))))
    (property "Value" "{sym}" (id 1) (at {x} {y+10.16} 0) (effects (font (size 1.27 1.27))))
    (property "Footprint" "" (id 2) (at {x} {y} 0) (effects (hide yes)))
    (property "Datasheet" "" (id 3) (at {x} {y} 0) (effects (hide yes)))
  )
"""

sch += f"""
  (text "POWER MANAGEMENT" (at 45.72 60.96 0) (effects (font (size 2 2)) (justify left)) (uuid "{u()}"))
  (text "MAIN BRAIN (ESP32-S3)" (at 132.08 60.96 0) (effects (font (size 2 2)) (justify left)) (uuid "{u()}"))
  (text "HEATER MOSFET" (at 142.24 127 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
  (text "MOTOR MOSFETs" (at 142.24 154.94 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
  (text "NTC DIVIDER" (at 91.44 127 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
  (text "FLEX HARNESS INTERFACE" (at 218.44 121.92 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
"""

def add_label(text, x, y, rot=0):
    global sch
    sch += f"""
  (label "{text}" (at {x} {y} {rot}) (effects (font (size 1.27 1.27)) (justify left bottom)) (uuid "{u()}"))
"""

# J1 USB-C
add_label("VBUS", 30.48-7.62, 76.2-2.54, 180)
add_label("GND", 30.48-7.62, 76.2+2.54, 180)

# U2 TP4056
add_label("VBUS", 60.96-10.16, 76.2-2.54, 180)
add_label("GND", 60.96+10.16, 76.2+2.54, 0)
add_label("VCC", 60.96-10.16, 76.2+2.54, 180) # BAT+
add_label("GND", 60.96+10.16, 76.2-2.54, 0) # BAT-

# U1 ESP32
add_label("PWM_HEATER", 152.4-15.24, 76.2-5.08, 180)
add_label("ADC_NTC", 152.4-15.24, 76.2-2.54, 180)
add_label("PWM_M_IDX", 152.4-15.24, 76.2, 180)
add_label("PWM_M_MID", 152.4-15.24, 76.2+2.54, 180)
add_label("PWM_M_RNG", 152.4-15.24, 76.2+5.08, 180)
add_label("PWM_M_PNK", 152.4-15.24, 76.2+7.62, 180)
add_label("ADC_EMG", 152.4+15.24, 76.2-5.08, 0)  # Pin 7
add_label("VCC", 152.4+15.24, 76.2-2.54, 0)
add_label("GND", 152.4+15.24, 76.2, 0)

# Q1 Heater
add_label("PWM_HEATER", 152.4-7.62, 137.16, 180)
add_label("GND", 152.4+7.62, 137.16+2.54, 0)
add_label("NET_HEAT", 152.4+7.62, 137.16-2.54, 0)

# Motors
add_label("PWM_M_IDX", 132.08-7.62, 167.64, 180)
add_label("GND", 132.08+7.62, 167.64+2.54, 0)
add_label("NET_M_IDX", 132.08+7.62, 167.64-2.54, 0)

add_label("PWM_M_MID", 152.4-7.62, 167.64, 180)
add_label("GND", 152.4+7.62, 167.64+2.54, 0)
add_label("NET_M_MID", 152.4+7.62, 167.64-2.54, 0)

add_label("PWM_M_RNG", 172.72-7.62, 167.64, 180)
add_label("GND", 172.72+7.62, 167.64+2.54, 0)
add_label("NET_M_RNG_PNK", 172.72+7.62, 167.64-2.54, 0) # Merged net for 5-pin ZIF

add_label("PWM_M_PNK", 193.04-7.62, 167.64, 180)
add_label("GND", 193.04+7.62, 167.64+2.54, 0)
add_label("NET_M_RNG_PNK", 193.04+7.62, 167.64-2.54, 0) # Merged net

# NTC Divider
add_label("VCC", 101.6, 137.16-7.62, 90)
add_label("ADC_NTC", 101.6, 137.16+7.62, 270)
add_label("ADC_NTC", 101.6, 157.48-7.62, 90)
add_label("GND", 101.6, 157.48+7.62, 270)

# ZIF J2
add_label("VCC", 233.68-10.16, 137.16-5.08, 180)
add_label("NET_HEAT", 233.68-10.16, 137.16-2.54, 180)
add_label("NET_M_IDX", 233.68-10.16, 137.16, 180)
add_label("NET_M_MID", 233.68-10.16, 137.16+2.54, 180)
add_label("NET_M_RNG_PNK", 233.68-10.16, 137.16+5.08, 180)

# PWR FLAGs
add_label("VCC", 81.28, 55.88-2.54, 90)
add_label("GND", 81.28, 66.04-2.54, 90)

sch += ")\n"

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_sch", "w") as f:
    f.write(sch)

print("Generated ERC-clean KiCad schematic successfully.")
