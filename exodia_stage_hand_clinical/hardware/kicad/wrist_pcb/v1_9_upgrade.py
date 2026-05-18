import os

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen10.py", "r") as f:
    gen = f.read()

# Update version
gen = gen.replace('v1.8', 'v1.9')

# Update ESP32 pin mappings for motors and heater
gen = gen.replace('connect_u1_pin("38", "PWM_M_IDX")', 'connect_u1_pin("21", "PWM_M_IDX")')
gen = gen.replace('connect_u1_pin("39", "PWM_M_MID")', 'connect_u1_pin("22", "PWM_M_MID")')
gen = gen.replace('connect_u1_pin("40", "PWM_M_RNG")', 'connect_u1_pin("23", "PWM_M_RNG")')
gen = gen.replace('connect_u1_pin("41", "PWM_M_PNK")', 'connect_u1_pin("24", "PWM_M_PNK")')
gen = gen.replace('connect_u1_pin("42", "PWM_HEATER")', 'connect_u1_pin("25", "PWM_HEATER")')

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen11.py", "w") as f:
    f.write(gen)
