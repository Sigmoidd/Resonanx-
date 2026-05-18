import pcbnew
board = pcbnew.LoadBoard("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pcb")

placements = {
    "U1": (125, 107, 0),        # ESP32 absolute top-center
    "J1": (103, 115, 0),        # USB-C at far left edge
    "R4": (110, 112, 90),       # CC1
    "R5": (110, 116, 90),       # CC2
    "U2": (118, 115, -90),      # TP4056
    "U3": (125, 115, 0),        # 3.3V LDO right below ESP32
    "J2": (145, 115, -90),      # ZIF at right side
    "Q1": (137, 110, 90),       # Big MOSFET near ZIF
    "Q2": (137, 117, 0),        # Motor MOSFETs
    "Q3": (137, 122, 0),
    "Q4": (137, 127, 0),
    "Q5": (137, 132, 0),
    "R2": (130, 110, 90),       # Gate Resistor near Q1
    "R3": (130, 114, 90),       # Pulldown near Q1
    "R1": (120, 128, 90),       # NTC Divider
    "RT1": (125, 128, 90),
}

for fp in board.GetFootprints():
    try:
        ref = fp.GetReferenceAsString()
    except AttributeError:
        try:
            ref = fp.GetReference()
        except:
            continue
            
    if ref in placements:
        x, y, rot = placements[ref]
        fp.SetPosition(pcbnew.VECTOR2I_MM(x, y))
        fp.SetOrientation(pcbnew.EDA_ANGLE(rot, pcbnew.DEGREES_T))

pcbnew.SaveBoard("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pcb", board)
