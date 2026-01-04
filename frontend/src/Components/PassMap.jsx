import './Pitch.css';
import "https://d3js.org/d3.v7.min.js";
import { useEffect } from "react";

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

function createArrowChart(data, playerData, pitchRect) {
  const relative = pitchRect.height / 100;

  if (!data || !Array.isArray(data)) {
    console.error('createArrowChart: data must be an array');
    data = [];
  }

  // Container
  const container = document.createElement("div");
  container.style.position = "relative";

  // Tooltip
  container.appendChild(createToolTip());

  // SVG
  const svg = d3.select(container).append("svg");
  svg.attr("width", pitchRect.width);
  svg.attr("height", pitchRect.height);

  // Arrow marker definition
  const defs = svg.append("defs");

  // Normal arrowhead
  defs.append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8) // tweak this for better coverage
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#333");

  // Orange arrowhead (for selection)
  defs.append("marker")
    .attr("id", "arrowhead-orange")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "orange");

  // Draw arrows
  svg.selectAll("line.arrow")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "arrow")
    .attr("x1", d => d.y * relative)
    .attr("y1", d => d.x * relative)
    .attr("x2", d => d.endY * relative)
    .attr("y2", d => d.endX * relative)
    .attr("stroke", "#333")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrowhead)")
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      const line = d3.select(this);
      const selected = line.classed("selected");

      // Clear previous selection
      svg.selectAll("line.arrow")
        .classed("selected", false)
        .attr("stroke", "#333")
        .attr("marker-end", "url(#arrowhead)");

      if (!selected) {
        // Highlight this arrow
        line.classed("selected", true)
          .attr("stroke", "orange")
          .attr("marker-end", "url(#arrowhead-orange)");
        
        const playerName = playerData[d.playerId] || "Unknown";

        // Show tooltip
        tooltip.style.display = "block";
        tooltip.innerHTML = `
          <strong>Player:</strong> ${playerName}<br/>
          <strong>Minute:</strong> ${d.expandedMinute}<br/>
          <strong>Result:</strong> ${d.outcomeType.displayName}
        `;
        tooltip.style.left = (event.offsetX + 10) + "px";
        tooltip.style.top = (event.offsetY + 10) + "px";
      } else {
        tooltip.style.display = "none";
      }
    });

  // Hide tooltip if clicking outside any line
  svg.on("click", function(event) {
    if (event.target.tagName !== "line") {
      tooltip.style.display = "none";
      svg.selectAll("line.arrow")
        .classed("selected", false)
        .attr("stroke", "#333")
        .attr("marker-end", "url(#arrowhead)");
    }
  });

  return container;
}

function PassMap(props) {
  useEffect(() => {
    if (!props.passData || !props.playerData || !props.pitchRect) return;
    const chart = createArrowChart(props.passData, props.playerData, props.pitchRect);
    const map = document.getElementById('map');
    map.innerHTML = "";
    map.append(chart);

    console.log(props.pitchRect, chart);
  }, [props.passData, props.pitchRect]);

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
