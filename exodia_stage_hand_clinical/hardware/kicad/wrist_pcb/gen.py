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
        (pin input line (at -12.54 5.08 0) (length 2.54) (name "GPIO4") (number "1"))
        (pin input line (at -12.54 2.54 0) (length 2.54) (name "GPIO5") (number "2"))
        (pin input line (at -12.54 0 0) (length 2.54) (name "GPIO6") (number "3"))
        (pin input line (at -12.54 -2.54 0) (length 2.54) (name "GPIO7") (number "4"))
        (pin input line (at -12.54 -5.08 0) (length 2.54) (name "GPIO15") (number "5"))
        (pin input line (at -12.54 -7.62 0) (length 2.54) (name "GPIO16") (number "6"))
        (pin input line (at 12.54 5.08 180) (length 2.54) (name "GPIO17") (number "7"))
        (pin power_in line (at 12.54 2.54 180) (length 2.54) (name "3V3") (number "8"))
        (pin power_in line (at 12.54 0 180) (length 2.54) (name "GND") (number "9"))
      )
    )
    (symbol "TP4056_IC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "U" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "TP4056" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "TP4056_IC_0_1"
        (rectangle (start -5 -5) (end 5 5) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -7.54 2.54 0) (length 2.54) (name "VIN") (number "1"))
        (pin output line (at -7.54 -2.54 0) (length 2.54) (name "BAT+") (number "2"))
        (pin output line (at 7.54 2.54 180) (length 2.54) (name "BAT-") (number "3"))
        (pin power_in line (at 7.54 -2.54 180) (length 2.54) (name "GND") (number "4"))
      )
    )
    (symbol "IRLZ44N" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "Q" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "IRLZ44N" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "IRLZ44N_0_1"
        (rectangle (start -3 -3) (end 3 3) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -5.54 0 0) (length 2.54) (name "G") (number "1"))
        (pin output line (at 5.54 2.54 180) (length 2.54) (name "D") (number "2"))
        (pin passive line (at 5.54 -2.54 180) (length 2.54) (name "S") (number "3"))
      )
    )
    (symbol "2N7002" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "Q" (id 0) (at 0 5 0) (effects (font (size 1.27 1.27))))
      (property "Value" "2N7002" (id 1) (at 0 -5 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "2N7002_0_1"
        (rectangle (start -3 -3) (end 3 3) (stroke (width 0) (type default)) (fill (type background)))
        (pin input line (at -5.54 0 0) (length 2.54) (name "G") (number "1"))
        (pin output line (at 5.54 2.54 180) (length 2.54) (name "D") (number "2"))
        (pin passive line (at 5.54 -2.54 180) (length 2.54) (name "S") (number "3"))
      )
    )
    (symbol "R_10K" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "R" (id 0) (at 0 2 0) (effects (font (size 1.27 1.27))))
      (property "Value" "10K" (id 1) (at 0 -2 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "R_10K_0_1"
        (rectangle (start -1 -2) (end 1 2) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at 0 -4.54 90) (length 2.54) (name "1") (number "1"))
        (pin passive line (at 0 4.54 270) (length 2.54) (name "2") (number "2"))
      )
    )
    (symbol "NTC" (pin_names (offset 1.016)) (in_bom yes) (on_board yes)
      (property "Reference" "RT" (id 0) (at 0 3 0) (effects (font (size 1.27 1.27))))
      (property "Value" "NTC" (id 1) (at 0 -3 0) (effects (font (size 1.27 1.27))))
      (property "Footprint" "" (id 2) (at 0 0 0) (effects (hide yes)))
      (property "Datasheet" "" (id 3) (at 0 0 0) (effects (hide yes)))
      (symbol "NTC_0_1"
        (rectangle (start -1 -2) (end 1 2) (stroke (width 0) (type default)) (fill (type background)))
        (pin passive line (at 0 -4.54 90) (length 2.54) (name "1") (number "1"))
        (pin passive line (at 0 4.54 270) (length 2.54) (name "2") (number "2"))
      )
    )
  )
"""

components = [
    ("U1", "ESP32S3_MODULE", 150, 100),
    ("U2", "TP4056_IC", 50, 100),
    ("Q1", "IRLZ44N", 150, 130),
    ("Q2", "2N7002", 150, 150),
    ("Q3", "2N7002", 170, 150),
    ("Q4", "2N7002", 190, 150),
    ("Q5", "2N7002", 210, 150),
    ("R1", "R_10K", 100, 130),
    ("RT1", "NTC", 100, 145),
]

for ref, sym, x, y in components:
    sch += f"""
  (symbol (lib_id "{sym}") (at {x} {y} 0) (unit 1) (in_bom yes) (on_board yes)
    (uuid "{u()}")
    (property "Reference" "{ref}" (id 0) (at {x} {y-8} 0) (effects (font (size 1.27 1.27))))
    (property "Value" "{sym}" (id 1) (at {x} {y+8} 0) (effects (font (size 1.27 1.27))))
    (property "Footprint" "" (id 2) (at {x} {y} 0) (effects (hide yes)))
    (property "Datasheet" "" (id 3) (at {x} {y} 0) (effects (hide yes)))
  )
"""

sch += ")\n"

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_sch", "w") as f:
    f.write(sch)

print("Generated KiCad schematic successfully.")
