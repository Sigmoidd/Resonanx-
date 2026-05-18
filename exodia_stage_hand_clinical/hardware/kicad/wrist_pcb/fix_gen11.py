import os

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen10.py", "r") as f:
    gen = f.read()

# Update version
gen = gen.replace('v1.8', 'v1.9')

# Change symbol pin mappings for U1 in the symbol definition (ESP32S3_MODULE_0_1)
old_pins = """        (pin output line (at -15.24 5.08 0) (length 5.08) (name "PWM_HEATER") (number "42"))
        (pin passive line (at -15.24 2.54 0) (length 5.08) (name "ADC_NTC") (number "8"))
        (pin output line (at -15.24 0 0) (length 5.08) (name "PWM_M_IDX") (number "38"))
        (pin output line (at -15.24 -2.54 0) (length 5.08) (name "PWM_M_MID") (number "39"))
        (pin output line (at -15.24 -5.08 0) (length 5.08) (name "PWM_M_RNG") (number "40"))
        (pin output line (at -15.24 -7.62 0) (length 5.08) (name "PWM_M_PNK") (number "41"))"""

new_pins = """        (pin output line (at -15.24 5.08 0) (length 5.08) (name "PWM_HEATER") (number "25"))
        (pin passive line (at -15.24 2.54 0) (length 5.08) (name "ADC_NTC") (number "8"))
        (pin output line (at -15.24 0 0) (length 5.08) (name "PWM_M_IDX") (number "21"))
        (pin output line (at -15.24 -2.54 0) (length 5.08) (name "PWM_M_MID") (number "22"))
        (pin output line (at -15.24 -5.08 0) (length 5.08) (name "PWM_M_RNG") (number "23"))
        (pin output line (at -15.24 -7.62 0) (length 5.08) (name "PWM_M_PNK") (number "24"))"""

# Make sure we normalize line endings in python replacement
gen = gen.replace(old_pins.replace('\r\n', '\n'), new_pins.replace('\r\n', '\n'))

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen11.py", "w") as f:
    f.write(gen)
