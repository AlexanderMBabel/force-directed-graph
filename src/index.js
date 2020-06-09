import * as d3 from 'd3';
import senators from './senate_committee_data.csv';

let nodes = senators.map((data) => {
  let committees = [];
  Object.keys(data).forEach((key) => {
    if (data[key] === 1) {
      committees.push(key);
    }
  });
  return {
    name: data.name,
    party: data.party,
    committees,
  };
});

function makeLinks(nodes) {
  let links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let s1 = nodes[i];
      let s2 = nodes[j];
      for (let k = 0; k < s1.committees.length; k++) {
        let committee = s1.committees[k];
        if (s2.committees.includes(committee)) {
          links.push({
            source: s1.name,
            target: s2.name,
          });
          break;
        }
      }
    }
  }
  return links;
}

let links = makeLinks(nodes);
let width = 750;
let height = 750;
let svg = d3.select('svg').attr('width', width).attr('height', height);

let linkGp = svg.append('g').classed('links', true);

let nodeGp = svg.append('g').classed('nodes', true);

let simulation = d3
  .forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-100))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force(
    'link',
    d3
      .forceLink(links)
      .distance((d) => {
        let count1 = d.source.committees.length;
        let count2 = d.target.committees.length;
        return 25 * Math.max(count1, count2);
      })
      .id((d) => d.name)
  )
  .on('tick', () => {
    linkGp
      .selectAll('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    nodeGp
      .selectAll('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  });

function graph(nodeData, linkData) {
  let partyScale = d3
    .scaleOrdinal()
    .domain(['D', 'R', 'I'])
    .range(['blue', 'red', 'gray']);

  let nodeUpdate = nodeGp.selectAll('circle').data(nodeData, (d) => d.name);

  nodeUpdate.exit().remove();

  nodeUpdate
    .enter()
    .append('circle')
    .attr('r', 15)
    .attr('fill', (d) => partyScale(d.party))
    .attr('stroke', 'white')
    .attr('stroke-width', 3);

  let linkUpdate = linkGp
    .selectAll('line')
    .data(linkData, (d) => d.source.name + d.target.name);

  linkUpdate.exit().remove();

  linkUpdate.enter().append('line').attr('stroke', 'gray');
}

graph(nodes, links);
