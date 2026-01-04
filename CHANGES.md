# Multifile
- Allowed passmap to rescale with the pitch when window / pitch is resized

# PassMap.jsx
- removed the need for useRef and useState in file
- pulled map style into separate variable for readability
- pulled tooltip creation into separate function

### Needing Fix
- when hovering over a pass on the right edge of the passmap, the tooltip
width shrinks as opposed to having dynamic width like in the middle or left of the passmap
- when passmap is resizing with the pitch, the line widths dont change so when you get
diagrams with lines that are either TOO WIDE or TOO NARROW

# Search.jsx
- (TEST PURPOSE) Search.jsx now loads a temporary test url so refresh automatically goes to Chalkboard 

# Pitch.jsx
### Needing Fix
- corners are scaled (?) positioned incorrectly

# Chalkboard.jsx
- changed log -> error for better logging
