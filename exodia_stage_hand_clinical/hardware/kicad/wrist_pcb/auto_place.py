import pcbnew
import math

board = pcbnew.LoadBoard("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pcb")

# Create a 40x30mm Board Outline
edge_cuts = board.GetLayerID("Edge.Cuts")

# Delete old Edge.Cuts if any
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

# Box from (100, 100) to (140, 130) -> 40x30mm
x_start, y_start = 100, 100
x_end, y_end = 140, 130

add_line(x_start, y_start, x_end, y_start)
add_line(x_end, y_start, x_end, y_end)
add_line(x_end, y_end, x_start, y_end)
add_line(x_start, y_end, x_start, y_start)

# Move components
placements = {
    "J1": (100, 115, 0),        # USB-C at left edge
    "U2": (110, 105, -90),      # TP4056 near top-left
    "U1": (120, 115, -90),      # ESP32 in the center, rotated 90
    "Q1": (130, 110, 180),      # Big Heater MOSFET near ZIF
    "Q2": (130, 118, 0),        # Motor MOSFET
    "Q3": (130, 122, 0),        # Motor MOSFET
    "Q4": (130, 126, 0),        # Motor MOSFET
    "Q5": (135, 126, 0),        # Motor MOSFET
    "J2": (140, 115, 180),      # ZIF at right edge
    "R1": (115, 125, 90),       # NTC divider near bottom
    "RT1": (120, 125, 90),      # NTC thermistor near bottom
}

for fp in board.GetFootprints():
    ref = fp.GetReference()
    if ref in placements:
        x, y, rot = placements[ref]
        fp.SetPosition(pcbnew.VECTOR2I_MM(x, y))
        fp.SetOrientation(pcbnew.EDA_ANGLE(rot, pcbnew.DEGREES_T))

pcbnew.SaveBoard("c:/Users/Admin/Documents/resonanx/exodia_stage_hand_clinical/hardware/kicad/wrist_pcb/wrist_pcb.kicad_pcb", board)
print("Auto-placed components and created board outline successfully.")
