import os

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen9.py", "r") as f:
    gen = f.read()

cap_sym = """
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
"""

gen = gen.replace('(symbol "PWR_FLAG"', cap_sym + '\n    (symbol "PWR_FLAG"')

comp_add = """
    ("C1", "CAPACITOR", 60.96, 96.52, "10uF"),
    ("C2", "CAPACITOR", 71.12, 96.52, "10uF"),
    ("C3", "CAPACITOR", 81.28, 96.52, "1uF"),
    ("C4", "CAPACITOR", 91.44, 96.52, "1uF"),
    ("C5", "CAPACITOR", 132.08, 35.56, "10uF"),
    ("C6", "CAPACITOR", 142.24, 35.56, "0.1uF"),
"""
gen = gen.replace('("#FLG1",', comp_add + '\n    ("#FLG1",')

labels_add = """
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

"""
gen = gen.replace('# PWR FLAGs', labels_add + '\n# PWR FLAGs')

gen = gen.replace('v1.7', 'v1.8')

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen10.py", "w") as f:
    f.write(gen)
