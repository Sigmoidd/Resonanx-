import pcbnew

board = pcbnew.LoadBoard("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pcb")
edge_cuts = board.GetLayerID("Edge.Cuts")

# Delete old Edge.Cuts
for item in board.GetDrawings():
    if item.GetLayer() == edge_cuts:
        board.Remove(item)

def add_line(x1, y1, x2, y2):
    line = pcbnew.PCB_SHAPE(board)
    line.SetShape(pcbnew.SHAPE_T_SEGMENT)
    line.SetLayer(edge_cuts)
    line.SetStart(pcbnew.VECTOR2I_MM(x1, y1))
    line.SetEnd(pcbnew.VECTOR2I_MM(x2, y2))
    line.SetWidth(pcbnew.FromMM(0.1))
    board.Add(line)

# Make board bigger: 50mm wide x 35mm tall
# Origin at 100, 100 for top-left
x_start, y_start = 100, 100
x_end, y_end = 150, 135

add_line(x_start, y_start, x_end, y_start)
add_line(x_end, y_start, x_end, y_end)
add_line(x_end, y_end, x_start, y_end)
add_line(x_start, y_end, x_start, y_start)

# Clean Placements
placements = {
    "U1": (125, 107, 0),        # ESP32 absolute top-center. Keepout hangs entirely off top edge.
    "J1": (102, 115, 0),        # USB-C at far left edge, pointing out.
    "U2": (113, 115, -90),      # TP4056 near USB-C
    "J2": (145, 115, -90),      # ZIF at right side
    "Q1": (137, 110, 90),       # Big MOSFET near ZIF
    "Q2": (137, 117, 0),        # Motor MOSFETs lined up
    "Q3": (137, 122, 0),
    "Q4": (137, 127, 0),
    "Q5": (137, 132, 0),
    "R1": (120, 128, 90),       # Resistors safely below ESP32
    "RT1": (125, 128, 90),
}

for fp in board.GetFootprints():
    ref = fp.GetReference()
    if ref in placements:
        x, y, rot = placements[ref]
        fp.SetPosition(pcbnew.VECTOR2I_MM(x, y))
        fp.SetOrientation(pcbnew.EDA_ANGLE(rot, pcbnew.DEGREES_T))

pcbnew.SaveBoard("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pcb", board)
