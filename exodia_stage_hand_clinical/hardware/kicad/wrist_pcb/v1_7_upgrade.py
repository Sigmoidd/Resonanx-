import json
import os

pro_file = "c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pro"
with open(pro_file, 'r') as f:
    data = json.load(f)

# Ensure classes exist
classes = data.get("net_settings", {}).get("classes", [])

power_high = {
    "bus_width": 12, "clearance": 0.3, "diff_pair_gap": 0.25, "diff_pair_via_gap": 0.25,
    "diff_pair_width": 0.2, "line_style": 0, "microvia_diameter": 0.3, "microvia_drill": 0.1,
    "name": "power_high", "pcb_color": "rgba(0, 0, 0, 0.000)", "priority": 1,
    "schematic_color": "rgba(0, 0, 0, 0.000)", "track_width": 0.5, "tuning_profile": "",
    "via_diameter": 0.8, "via_drill": 0.4, "wire_width": 6
}

signal_data = {
    "bus_width": 12, "clearance": 0.2, "diff_pair_gap": 0.25, "diff_pair_via_gap": 0.25,
    "diff_pair_width": 0.2, "line_style": 0, "microvia_diameter": 0.3, "microvia_drill": 0.1,
    "name": "signal_data", "pcb_color": "rgba(0, 0, 0, 0.000)", "priority": 2,
    "schematic_color": "rgba(0, 0, 0, 0.000)", "track_width": 0.25, "tuning_profile": "",
    "via_diameter": 0.6, "via_drill": 0.3, "wire_width": 6
}

# Remove existing if any, then append
classes = [c for c in classes if c["name"] not in ["power_high", "signal_data"]]
classes.append(power_high)
classes.append(signal_data)
data["net_settings"]["classes"] = classes

# Add netclass patterns
patterns = [
    {"netclass": "power_high", "pattern": "BAT+"},
    {"netclass": "power_high", "pattern": "VBUS"},
    {"netclass": "power_high", "pattern": "3V3"},
    {"netclass": "power_high", "pattern": "GND"},
    {"netclass": "power_high", "pattern": "NET_HEAT"},
    {"netclass": "power_high", "pattern": "GATE_HEAT"},
    {"netclass": "signal_data", "pattern": "*"}
]
data["net_settings"]["netclass_patterns"] = patterns

with open(pro_file, 'w') as f:
    json.dump(data, f, indent=2)

# Now read gen8.py to create gen9.py
with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen8.py", "r") as f:
    gen8 = f.read()

gen9 = gen8.replace('v1.6', 'v1.7')
gen9 = gen9.replace('("Q1", "IRLZ44N", 172.72, 137.16)', '("Q1", "AO3400A", 172.72, 137.16)')
gen9 = gen9.replace('symbol "IRLZ44N"', 'symbol "AO3400A"')
gen9 = gen9.replace('Value" "IRLZ44N"', 'Value" "AO3400A"')
gen9 = gen9.replace('symbol "IRLZ44N_0_1"', 'symbol "AO3400A_0_1"')
# Fix AO3400A pins (SOT-23 pinout: 1=G, 2=S, 3=D)
old_irlz = """(pin input line (at -7.62 0 0) (length 5.08) (name "G") (number "1"))
        (pin passive line (at 7.62 2.54 180) (length 5.08) (name "D") (number "2"))
        (pin passive line (at 7.62 -2.54 180) (length 5.08) (name "S") (number "3"))"""
new_ao3400a = """(pin input line (at -7.62 0 0) (length 5.08) (name "G") (number "1"))
        (pin passive line (at 7.62 2.54 180) (length 5.08) (name "D") (number "3"))
        (pin passive line (at 7.62 -2.54 180) (length 5.08) (name "S") (number "2"))"""
gen9 = gen9.replace(old_irlz, new_ao3400a)

with open("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/gen9.py", "w") as f:
    f.write(gen9)
