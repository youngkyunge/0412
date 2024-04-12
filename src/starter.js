import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg

const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
const width = parseInt(d3.select("#svg-container").style("width"));
const height = parseInt(d3.select("#svg-container").style("height"));

console.log(width + "," + height);
const margin = { top: 65, right: 50, bottom: 65, left: 50 };

// group
const g = svg
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

// scale
let minLen = d3.min([height / 2 - margin.top, width / 2 - margin.right]);
const radiusScale = d3.scaleLinear().domain([0, 100]).range([0, minLen]);

const attributes = [
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physic",
];
const angleScale = d3
  .scaleLinear()
  .domain([0, attributes.length])
  .range([0, 2 * Math.PI]);

const radius = [0, 25, 50, 75, 100];

//color
const pointColor = "#523289";

// line radial
const radarLine = d3
  .lineRadial()
  .curve(d3.curveCardinalClosed)
  .angle((d, i) => angleScale(i))
  .radius((d) => radiusScale(selectedPlayer[d]));

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
// data

let data = [];
let selectedPlayer;

let radiusAxis, angleAxis, labels;

d3.json("data/fifa23_maleplayers.json").then((raw_data) => {
  data = raw_data.filter((d) => d.overall > 85);
  selectedPlayer = data.filter((d) => d.short_name === "H. Son")[0];

  // console.log(selectedPlayer);

  //axis

  radiusAxis = g
    .selectAll("radius-axis")
    .data(radius)
    .enter()
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => radiusScale(d))
    .attr("fill", "rgba(10,10,10,0.01")
    .attr("stroke", "#c3c3c3")
    .attr("stroke-width", 0.5);

  angleAxis = g
    .selectAll("angle-axis")
    .data(attributes)
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", (d, i) => getXPos(100, i))
    .attr("y1", 0)
    .attr("y2", (d, i) => getYPos(100, i))
    .attr("stroke", "#ccc")
    .attr("stroke-width", 0.5);

  labels = g
    .selectAll("lables")
    .data(attributes)
    .enter()
    .append("text")
    .attr("x", (d, i) => getXPos(116, i))
    .attr("y", (d, i) => getYPos(116, i))
    .text((d) => d)
    .attr("class", "labels");

  path = g
    .append("path")
    .datum(attributes)
    .attr("d", radarLine)
    .attr("fill", pointColor)
    .attr("stroke", pointColor)
    .attr("stroke-width", 1.3)
    .style("fill-opacity", 0.1);
});

// function
const getXPos = (dist, index) => {
  //radius * cos (theta)
  return radiusScale(dist) * Math.cos(angleScale(index) - Math.PI / 2);
};

const getYPos = (dist, index) => {
  //radius * cos (theta)
  return radiusScale(dist) * Math.sin(angleScale(index) - Math.PI / 2);
};
