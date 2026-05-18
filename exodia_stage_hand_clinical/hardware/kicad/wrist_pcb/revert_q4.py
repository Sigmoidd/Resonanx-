import os

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen11.py", "r") as f:
    gen = f.read()

# Update version to v1.10
gen = gen.replace('v1.9', 'v1.10')

# Change ONLY PWM_M_RNG back to pin 40 in the symbol definition
old_pins = """        (pin output line (at -15.24 5.08 0) (length 5.08) (name "PWM_HEATER") (number "25"))
        (pin passive line (at -15.24 2.54 0) (length 5.08) (name "ADC_NTC") (number "8"))
        (pin output line (at -15.24 0 0) (length 5.08) (name "PWM_M_IDX") (number "21"))
        (pin output line (at -15.24 -2.54 0) (length 5.08) (name "PWM_M_MID") (number "22"))
        (pin output line (at -15.24 -5.08 0) (length 5.08) (name "PWM_M_RNG") (number "23"))
        (pin output line (at -15.24 -7.62 0) (length 5.08) (name "PWM_M_PNK") (number "24"))"""

new_pins = """        (pin output line (at -15.24 5.08 0) (length 5.08) (name "PWM_HEATER") (number "25"))
        (pin passive line (at -15.24 2.54 0) (length 5.08) (name "ADC_NTC") (number "8"))
        (pin output line (at -15.24 0 0) (length 5.08) (name "PWM_M_IDX") (number "21"))
        (pin output line (at -15.24 -2.54 0) (length 5.08) (name "PWM_M_MID") (number "22"))
        (pin output line (at -15.24 -5.08 0) (length 5.08) (name "PWM_M_RNG") (number "40"))
        (pin output line (at -15.24 -7.62 0) (length 5.08) (name "PWM_M_PNK") (number "24"))"""

gen = gen.replace(old_pins.replace('\r\n', '\n'), new_pins.replace('\r\n', '\n'))

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen12.py", "w") as f:
    f.write(gen)
