import './Pitch.css';
import "https://d3js.org/d3.v7.min.js";
import { useEffect } from "react";


function highlightSelected({
  selectedElement = null,
  svg,
  blockedGroup,
  GRAY_TEAM_ID,
  TEAM_COLORS,
  OUTCOME_COLORS
}) {
  if (!selectedElement) {
    // Restore all arrows
    svg.selectAll("line.arrow")
      .attr("stroke", d => TEAM_COLORS[d.teamId] ?? "#999")
      .attr("marker-end", d => `url(#arrowhead-team-${d.teamId})`)
      .attr("opacity", 0.8);

    // Restore all blocked Xs
    blockedGroup.selectAll("g.blocked").each(function(d) {
      const color = TEAM_COLORS[d.teamId] ?? "#999";
      d3.select(this).selectAll("line")
        .attr("stroke", color)
        .attr("opacity", 1);
    });

    return;
  }

  const d = d3.select(selectedElement).datum();

  // Dim all arrows
  svg.selectAll("line.arrow")
    .attr("stroke", "#999")
    .attr("opacity", 0.2)
    .attr("marker-end", `url(#arrowhead-team-${GRAY_TEAM_ID})`);

  // Dim all blocked Xs **except the selected one**
  blockedGroup.selectAll("g.blocked").each(function(blockedDatum) {
    const isSelected = this === selectedElement;
    const color = isSelected
      ? TEAM_COLORS[blockedDatum.teamId] ?? "#999"  // keep team color for selected
      : "#999";                                     // gray for others

    d3.select(this).selectAll("line")
      .attr("stroke", color)
      .attr("opacity", isSelected ? 1 : 0.2);
  });

  // Highlight the selected element
  if ("x" in d && "y" in d) {
    // Selected arrow
    d3.select(selectedElement)
      .attr("stroke", OUTCOME_COLORS[d.outcomeType.displayName] ?? "#999")
      .attr("marker-end", `url(#arrowhead-${d.outcomeType.displayName})`)
      .attr("opacity", 0.8);
  }
}



function createToolTip() {
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.pointerEvents = "none";
  tooltip.style.background = "rgba(0,0,0,0.7)";
  tooltip.style.color = "white";
  tooltip.style.padding = "4px 8px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "12px";
  tooltip.style.display = "none";
  return tooltip;
}


function createArrowChart(passData, playerData, pitchRect, teamData, selectedPlayers) {

  const relative_height = pitchRect.height / 100;
  const relative_width = pitchRect.width / 100;

  let blocked = passData['Blocked'];

  blocked.forEach(d => {
    if (d.outcomeType) {
      d.outcomeType.displayName = "Blocked";
    } else {
      d.outcomeType = { displayName: "blocked" };
    }
  });


  // Sets offside passes to be offside
  const offsides = passData['Offside'];

  offsides.forEach(d => {
    if (d.outcomeType) {
      d.outcomeType.displayName = "Offside";
    } else {
      d.outcomeType = { displayName: "Offside" };
    }
  });

  let data = passData["Pass"];
  data.push(...offsides)

  // Filters selected players
  if (selectedPlayers.length !== 0) {
    data = data.filter(d => selectedPlayers.includes(d.playerId));
    blocked = blocked.filter(d => selectedPlayers.includes(d.playerId));
  }
  

  if (!data || !Array.isArray(data)) {
    console.error('createArrowChart: data must be an array');
    data = [];
  }

  // Container
  const container = document.createElement("div");
  container.style.position = "relative";

  // Tooltip
  const tooltip = createToolTip();
  container.appendChild(tooltip);

  // SVG
  const svg = d3.select(container).append("svg");
  svg.attr("width", pitchRect.width);
  svg.attr("height", pitchRect.height);

  // Arrow marker definition
  const defs = svg.append("defs");

  // Get Team Names
  const TEAM_ID_TO_NAME = {
    [teamData.home.teamId]: teamData.home.name,
    [teamData.away.teamId]: teamData.away.name,
  };

  // Unselected Colors
  const GRAY_TEAM_ID = -1;

  // Arrow Team color 
  const TEAM_COLORS = {
    [teamData.home.teamId]: "#291fb4ff",
    [teamData.away.teamId]: "#a2d310ff",
    [GRAY_TEAM_ID]: "#999"
  };

  // Change opacities based on selection
  const TEAM_OPACITIES = {
    [teamData.home.teamId]: .8,
    [teamData.away.teamId]: .8,
    [GRAY_TEAM_ID]: .8
  };

  // Arrow PassType Color
  const OUTCOME_COLORS = {
    Successful: "#90eeabff",
    Unsuccessful: "#d47979ff",
    Offside: "#8a8a8a",
  };


  // Normal arrowhead
  Object.entries(TEAM_COLORS).forEach(([teamId, color]) => {
    defs.append("marker")
      .attr("id", `arrowhead-team-${teamId}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", color)
      .attr("opacity", TEAM_OPACITIES[teamId]);
  });

  // Selected arrowhead
  Object.entries(OUTCOME_COLORS).forEach(([outcome, color]) => {
    defs.append("marker")
      .attr("id", `arrowhead-${outcome}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", color);
  });


  // Draw arrows
  svg.selectAll("line.arrow")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "arrow")
    .attr("x1", d => d.y * relative_width)
    .attr("y1", d => d.x * relative_height)
    .attr("x2", d => d.endY * relative_width)
    .attr("y2", d => d.endX * relative_height)
    .attr("stroke", d => TEAM_COLORS[d.teamId] ?? "#999")
    .attr("stroke-width", 2)
    .attr("marker-end", d => `url(#arrowhead-team-${d.teamId})`)
    .style("cursor", "pointer")
      .on("mouseenter click", function(event, d) {
      const line = d3.select(this);
      const selected = line.classed("selected");

      // Clear previous selection
      svg.selectAll("line.arrow")
        .classed("selected", false)
        .attr("opacity", .2)
        .attr("stroke", "#999")
        .attr("marker-end", `url(#arrowhead-team-${GRAY_TEAM_ID})`)

      if (!selected) {
        // Highlight this arrow
        highlightSelected({
          selectedElement: this,
          svg,
          blockedGroup,
          GRAY_TEAM_ID,
          TEAM_COLORS,
          OUTCOME_COLORS
        });
        
        const playerName = playerData[d.playerId] ?? "Unknown Name";
        const teamName = TEAM_ID_TO_NAME[d.teamId] ?? "Unknown Team";

        // Show tooltip
        tooltip.style.display = "block";
        tooltip.innerHTML = `
          <strong>Player:</strong> ${playerName}<br/>
          <strong>Team:</strong> ${teamName}<br/>
          <strong>Minute:</strong> ${d.expandedMinute}<br/>
          <strong>Result:</strong> ${d.outcomeType.displayName}
        `;
        tooltip.style.left = (event.offsetX + 10) + "px";
        tooltip.style.top = (event.offsetY + 10) + "px";
      } else {
        tooltip.style.display = "none";
      }
    }).on("mouseleave", function () {
      // Restore arrows to original colors
      highlightSelected({
        selectedElement: null,
        svg,
        blockedGroup,
        GRAY_TEAM_ID,
        TEAM_COLORS,
        OUTCOME_COLORS
      });
      tooltip.style.display = "none";
    });

  // Hide tooltip if clicking outside any line
  svg.on("click", function(event) {
    if (event.target.tagName !== "line") {
      tooltip.style.display = "none";
      svg.selectAll("line.arrow")
        .classed("selected", false)
        .attr("stroke", d => TEAM_COLORS[d.teamId] ?? "#999")
        .attr("marker-end", d => `url(#arrowhead-team-${d.teamId})`)
    }
  });

  // Marker for Blocked Passes
  const blockedGroup = svg.append("g")
  .attr("class", "blocked-events");

  // Size of the X
  const X_SIZE = 4;

  blockedGroup.selectAll("g.blocked")
    .data(blocked)
    .enter()
    .append("g")
    .attr("class", "blocked")
    .attr("transform", d => {
      const cx = d.y * relative_width;
      const cy = d.x * relative_height;
      return `translate(${cx}, ${cy})`;
    })
    .each(function(d) {
      const g = d3.select(this);

      const color = TEAM_COLORS[d.teamId] ?? "#999";

      // Invisible circle to trigger hover
      g.append("circle")
        .attr("r", 6)
        .attr("fill", "transparent")
        .attr("stroke", "none")
        .attr("pointer-events", "all");

      // Line 1 of X
      g.append("line")
        .attr("x1", -X_SIZE)
        .attr("y1", -X_SIZE)
        .attr("x2", X_SIZE)
        .attr("y2", X_SIZE)
        .attr("stroke", color)
        .attr("stroke-width", 2);

      // Line 2 of X
      g.append("line")
        .attr("x1", -X_SIZE)
        .attr("y1", X_SIZE)
        .attr("x2", X_SIZE)
        .attr("y2", -X_SIZE)
        .attr("stroke", color)
        .attr("stroke-width", 2);
    });

    // Marker for Blocked Passes
    blockedGroup.selectAll("g.blocked")
      .on("mouseenter click", function(event, d) {
        // Dim all X's to gray
        highlightSelected({
          selectedElement: this,
          svg,
          blockedGroup,
          GRAY_TEAM_ID,
          TEAM_COLORS,
          OUTCOME_COLORS
        });

        // Show tooltip
        const playerName = playerData[d.playerId] ?? "Unknown Name";
        const teamName = TEAM_ID_TO_NAME[d.teamId] ?? "Unknown Team";

        tooltip.style.display = "block";
        tooltip.innerHTML = `
          <strong>Player:</strong> ${playerName}<br/>
          <strong>Team:</strong> ${teamName}<br/>
          <strong>Minute:</strong> ${d.expandedMinute}<br/>
          <strong>Result:</strong> ${d.outcomeType.displayName}
        `;
        tooltip.style.left = (event.offsetX + 10) + "px";
        tooltip.style.top = (event.offsetY + 10) + "px";
      })
      .on("mouseleave", function() {

        highlightSelected({
          selectedElement: null,
          svg,
          blockedGroup,
          GRAY_TEAM_ID,
          TEAM_COLORS,
          OUTCOME_COLORS
        });
        tooltip.style.display = "none";
      });


  return container;
}

function PassMap(props) {
  
  useEffect(() => {
    console.log(props.selectedPlayers);
    if (!props.passData || !props.teamData || !props.playerData || !props.pitchRect) return;
    
    const chart = createArrowChart(props.passData, props.playerData, props.pitchRect, props.teamData, props.selectedPlayers);
    const map = document.getElementById('map');
    map.innerHTML = "";
    map.append(chart);
  }, [props.passData, props.pitchRect, props.selectedPlayers]);

  const passMapStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%"
  }

  return (
    <div id = 'map' style={passMapStyle}/>
  );
}


export default PassMap;
