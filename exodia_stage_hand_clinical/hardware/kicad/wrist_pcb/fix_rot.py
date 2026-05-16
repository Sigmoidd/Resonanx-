import pcbnew
board = pcbnew.LoadBoard("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pcb")
for fp in board.GetFootprints():
    if fp.GetReference() == "U1":
        fp.SetPosition(pcbnew.VECTOR2I_MM(120, 120))
        fp.SetOrientation(pcbnew.EDA_ANGLE(0, pcbnew.DEGREES_T))
pcbnew.SaveBoard("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pcb", board)
