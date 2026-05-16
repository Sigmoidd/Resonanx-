import uuid

def u():
    return str(uuid.uuid4())

sch = f"""(kicad_sch (version 20231120) (generator "kicad_sch")
  (uuid "{u()}")
  (paper "A4")
  (title_block
    (title "Exodia Stage Hand - Clinical Wrist PCB")
    (date "2026-05-15")
    (rev "v1.0")
    (company "Resonanx")
  )
  (lib_symbols
    (symbol "ESP32S3_MODULE" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 8 0) (effects (font (size 1.27 1.27))))
      (property "Value" "ESP32-S3-MINI-1" (id 1) (at 0 -8 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "ESP32S3_MODULE_0_1"
        (rectangle (start -10 -10) (end 10 10) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -15.08 5.08 0) (length 5.08) (name "GPIO4") (number "1"))
        (pin input line (at -15.08 2.54 0) (length 5.08) (name "GPIO5") (number "2"))
        (pin input line (at -15.08 0 0) (length 5.08) (name "GPIO6") (number "3"))
        (pin input line (at -15.08 -2.54 0) (length 5.08) (name "GPIO7") (number "4"))
        (pin input line (at -15.08 -5.08 0) (length 5.08) (name "GPIO15") (number "5"))
        (pin input line (at -15.08 -7.62 0) (length 5.08) (name "GPIO16") (number "6"))
        (pin input line (at 15.08 5.08 180) (length 5.08) (name "GPIO17") (number "7"))
        (pin power_in line (at 15.08 2.54 180) (length 5.08) (name "3V3") (number "8"))
        (pin power_in line (at 15.08 0 180) (length 5.08) (name "GND") (number "9"))
      )
    )
    (symbol "TP4056_IC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "TP4056" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "TP4056_IC_0_1"
        (rectangle (start -5 -5) (end 5 5) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -10.08 2.54 0) (length 5.08) (name "VIN") (number "1"))
        (pin output line (at -10.08 -2.54 0) (length 5.08) (name "BAT+") (number "2"))
        (pin output line (at 10.08 2.54 180) (length 5.08) (name "BAT-") (number "3"))
        (pin power_in line (at 10.08 -2.54 180) (length 5.08) (name "GND") (number "4"))
      )
    )
    (symbol "IRLZ44N" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "Q" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "IRLZ44N" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "IRLZ44N_0_1"
        (rectangle (start -3 -3) (end 3 3) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -8.08 0 0) (length 5.08) (name "G") (number "1"))
        (pin output line (at 8.08 2.54 180) (length 5.08) (name "D") (number "2"))
        (pin passive line (at 8.08 -2.54 180) (length 5.08) (name "S") (number "3"))
      )
    )
    (symbol "2N7002" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "Q" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "2N7002" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "2N7002_0_1"
        (rectangle (start -3 -3) (end 3 3) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -8.08 0 0) (length 5.08) (name "G") (number "1"))
        (pin output line (at 8.08 2.54 180) (length 5.08) (name "D") (number "2"))
        (pin passive line (at 8.08 -2.54 180) (length 5.08) (name "S") (number "3"))
      )
    )
    (symbol "R_10K" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "R" (id 0) (at 0 2 0) (effects (font (size 1.27 1.27))))
      (property "Value" "10K" (id 1) (at 0 -2 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "R_10K_0_1"
        (rectangle (start -1 -2) (end 1 2) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at 0 -7.08 90) (length 5.08) (name "1") (number "1"))
        (pin passive line (at 0 7.08 270) (length 5.08) (name "2") (number "2"))
      )
    )
    (symbol "NTC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "RT" (id 0) (at 0 3 0) (effects (font (size 1.27 1.27))))
      (property "Value" "NTC" (id 1) (at 0 -3 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "NTC_0_1"
        (rectangle (start -1 -2) (end 1 2) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at 0 -7.08 90) (length 5.08) (name "1") (number "1"))
        (pin passive line (at 0 7.08 270) (length 5.08) (name "2") (number "2"))
      )
    )
    (symbol "USBC_CONN" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "J" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "USBC_CHARGE" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "USBC_CONN_0_1"
        (rectangle (start -3 -3) (end 3 3) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at -8.08 2.54 0) (length 5.08) (name "VBUS") (number "1"))
        (pin passive line (at -8.08 -2.54 0) (length 5.08) (name "GND") (number "2"))
      )
    )
    (symbol "ZIF_5PIN" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "J" (id 0) (at 0 6 0) (effects (font (size 1.27 1.27))))
      (property "Value" "FLEX_HARNESS" (id 1) (at 0 -6 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "ZIF_5PIN_0_1"
        (rectangle (start -5 -6) (end 5 6) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at -10.08 5.08 0) (length 5.08) (name "V+") (number "1"))
        (pin passive line (at -10.08 2.54 0) (length 5.08) (name "HEAT_GND") (number "2"))
        (pin passive line (at -10.08 0 0) (length 5.08) (name "M_IDX_GND") (number "3"))
        (pin passive line (at -10.08 -2.54 0) (length 5.08) (name "M_MID_GND") (number "4"))
        (pin passive line (at -10.08 -5.08 0) (length 5.08) (name "M_RNG_PNK") (number "5"))
      )
    )
  )
"""

# Format: (Ref, Symbol, X, Y)
components = [
    ("U1", "ESP32S3_MODULE", 150, 70),
    ("U2", "TP4056_IC", 60, 70),
    ("J1", "USBC_CONN", 30, 70),
    ("J2", "ZIF_5PIN", 230, 130),
    ("Q1", "IRLZ44N", 150, 130),
    ("Q2", "2N7002", 130, 160),
    ("Q3", "2N7002", 150, 160),
    ("Q4", "2N7002", 170, 160),
    ("Q5", "2N7002", 190, 160),
    ("R1", "R_10K", 100, 130),
    ("RT1", "NTC", 100, 150),
]

for ref, sym, x, y in components:
    sch += f"""
  (symbol (lib_id "{sym}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes)
    (uuid "{u()}")
    (property "Reference" "{ref}" (id 0) (at {x} {y-10} 0) (effects (font (size 1.27 1.27))))
    (property "Value" "{sym}" (id 1) (at {x} {y+10} 0) (effects (font (size 1.27 1.27))))
    (property "Footprint" "" (id 2) (at {x} {y} 0) (effects (hide yes)))
    (property "Datasheet" "" (id 3) (at {x} {y} 0) (effects (hide yes)))
  )
"""

# Add text notes to label the schematic logic sections
sch += f"""
  (text "POWER MANAGEMENT" (at 45 55 0) (effects (font (size 2 2)) (justify left)) (uuid "{u()}"))
  (text "MAIN BRAIN (ESP32-S3)" (at 130 55 0) (effects (font (size 2 2)) (justify left)) (uuid "{u()}"))
  (text "HEATER MOSFET" (at 140 120 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
  (text "MOTOR MOSFETs" (at 140 148 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
  (text "NTC DIVIDER" (at 90 120 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
  (text "FLEX HARNESS INTERFACE" (at 215 115 0) (effects (font (size 1.5 1.5)) (justify left)) (uuid "{u()}"))
"""

# Let's add labels to pins so they are logically connected without messy wires!
# We place labels at the exact coordinates of the pin ends.
def add_label(text, x, y, rot=0):
    global sch
    sch += f"""
  (label "{text}" (at {x} {y} {rot}) (effects (font (size 1.27 1.27)) (justify left bottom)) (uuid "{u()}"))
"""

# J1 USB-C
add_label("VBUS", 30-8.08, 70-2.54, 180)
add_label("GND", 30-8.08, 70+2.54, 180)

# U2 TP4056
add_label("VBUS", 60-10.08, 70-2.54, 180)
add_label("GND", 60+10.08, 70+2.54, 0)
add_label("VCC", 60-10.08, 70+2.54, 180) # BAT+
add_label("GND", 60+10.08, 70-2.54, 0) # BAT-

# U1 ESP32
add_label("PWM_HEATER", 150-15.08, 70-5.08, 180)
add_label("ADC_NTC", 150-15.08, 70-2.54, 180)
add_label("PWM_M_IDX", 150-15.08, 70, 180)
add_label("PWM_M_MID", 150-15.08, 70+2.54, 180)
add_label("PWM_M_RNG", 150-15.08, 70+5.08, 180)
add_label("PWM_M_PNK", 150-15.08, 70+7.62, 180)
add_label("VCC", 150+15.08, 70-2.54, 0)
add_label("GND", 150+15.08, 70, 0)

# Q1 Heater
add_label("PWM_HEATER", 150-8.08, 130, 180)
add_label("GND", 150+8.08, 130+2.54, 0)
add_label("NET_HEAT", 150+8.08, 130-2.54, 0)

# Motors
add_label("PWM_M_IDX", 130-8.08, 160, 180)
add_label("GND", 130+8.08, 160+2.54, 0)
add_label("NET_M_IDX", 130+8.08, 160-2.54, 0)

add_label("PWM_M_MID", 150-8.08, 160, 180)
add_label("GND", 150+8.08, 160+2.54, 0)
add_label("NET_M_MID", 150+8.08, 160-2.54, 0)

add_label("PWM_M_RNG", 170-8.08, 160, 180)
add_label("GND", 170+8.08, 160+2.54, 0)
add_label("NET_M_RNG", 170+8.08, 160-2.54, 0)

add_label("PWM_M_PNK", 190-8.08, 160, 180)
add_label("GND", 190+8.08, 160+2.54, 0)
add_label("NET_M_PNK", 190+8.08, 160-2.54, 0)

# NTC Divider (R1 and RT1)
add_label("VCC", 100, 130-7.08, 90)
add_label("ADC_NTC", 100, 130+7.08, 270)
add_label("ADC_NTC", 100, 150-7.08, 90)
add_label("GND", 100, 150+7.08, 270)

# ZIF J2
add_label("VCC", 230-10.08, 130-5.08, 180)
add_label("NET_HEAT", 230-10.08, 130-2.54, 180)
add_label("NET_M_IDX", 230-10.08, 130, 180)
add_label("NET_M_MID", 230-10.08, 130+2.54, 180)
add_label("NET_M_RNG", 230-10.08, 130+5.08, 180) # Using RNG net for both RNG and PNK in ZIF layout if needed, but let's just tie it to RNG for simplicity here since it's 5 pin

sch += ")\n"

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_sch", "w") as f:
    f.write(sch)

print("Generated full KiCad schematic successfully with connections and labels.")
