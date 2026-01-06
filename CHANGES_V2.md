# PassMap.jsx
- Added Colors based on team on default
- On selection, all colors are grayed out except for selected pass
- Selected passes, except blocked will have color based on outcomeType
- Added Offsides and Blocked Passes
- Blocked Passes is a different mark
- Added highlighted Selection function to select and gray out in one place
- Added Team Names to Tooltip
- Fixed relative x, and y differences


# Chalkboard.jsx
- Changed getPasses to return all types of passes
- Added getTeams to return team names and Ids


# Need To Now 
- Unselected colors and opacity are created using team id 0
- Right now code on lines 105,106 are commented so regular passes are not graphed


# Need to Do
- Make mark and arrow widths be based on percent so it scales with zoom
- Put different aspects of PassMaps into seperate functions for readability
- Solve tooltip overflow problem
- Add filters
- Probably other stuff too