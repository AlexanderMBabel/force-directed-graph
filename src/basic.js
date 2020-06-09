import * as d3 from 'd3';

import './styles/app.css';

let width = 600;
let height = 600;

let nodes = [
  { color: 'red', size: 5 },
  { color: 'orange', size: 10 },
  { color: 'yellow', size: 15 },
  { color: 'green', size: 20 },
  { color: 'blue', size: 25 },
  { color: 'purple', size: 30 },
];

let links = [
  { source: 'red', target: 'orange' },
  { source: 'orange', target: 'yellow' },
  { source: 'yellow', target: 'green' },
  { source: 'green', target: 'blue' },
  { source: 'blue', target: 'purple' },
  { source: 'purple', target: 'red' },
  { source: 'green', target: 'red' },
];

let svg = d3.select('svg').attr('width', width).attr('height', height);

let nodeSelection = svg
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('r', (d) => d.size)
  .attr('fill', (d) => d.color)
  .call(d3.drag().on('start', dragStart).on('drag', drag).on('end', dragEnd));

let linkSelection = svg
  .selectAll('line')
  .data(links)
  .enter()
  .append('line')
  .attr('stroke', 'black')
  .attr('stroke-width', 1);

let simulation = d3.forceSimulation(nodes);

simulation
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('manybody', d3.forceManyBody())
  .force(
    'links',
    d3
      .forceLink(links)
      .id((d) => d.color)
      .distance(300)
  )
  .on('tick', ticked);

function ticked() {
  nodeSelection.attr('cy', (d) => d.y).attr('cx', (d) => d.x);
  linkSelection
    .attr('x1', (d) => d.source.x)
    .attr('x2', (d) => d.target.x)
    .attr('y1', (d) => d.source.y)
    .attr('y2', (d) => d.target.y);
}

function dragStart(d) {
  d.fx = d.x;
  d.fy = d.y;
  simulation.alphaTarget(0.5).restart();
}
function drag(d) {
  //   simulation.alpha(0.5).restart();
  d.fy = d3.event.x;
  d.fx = d3.event.y;
}
function dragEnd(d) {
  simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
