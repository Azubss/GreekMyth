window.onload = function(){
  // The family tree data (you can use JSON format or fetch it from the server)
let data = {
  "name": "Chaos",
  "value": 100,
  "children": [
    {
      "name": "Gaia",
      "value": 90,
      "children": [
        {
          "name": "Uranus",
          "value": 80,
          "children": [
            {
              "name": "Cronus",
              "value": 75,
              "children": [
                {
                  "name": "Zeus",
                  "value": 70,
                  "children": [
                    {
                      "name": "Ares",
                      "value": 60
                    },
                    {
                      "name": "Athena",
                      "value": 60
                    },
                    {
                      "name": "Apollo",
                      "value": 60
                    },
                    {
                      "name": "Artemis",
                      "value": 60
                    },
                    {
                      "name": "Hermes",
                      "value": 60
                    },
                    {
                      "name": "Hephaestus",
                      "value": 60
                    }
                  ]
                },
                {
                  "name": "Poseidon",
                  "value": 70,
                  "children": [
                    {
                      "name": "Triton",
                      "value": 60
                    }
                  ]
                },
                {
                  "name": "Hades",
                  "value": 70,
                  "children": [
                    {
                      "name": "Macaria",
                      "value": 60
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "Pontus",
          "value": 80,
          "children": [
            {
              "name": "Thaumas",
              "value": 70,
              "children": [
                {
                  "name": "Iris",
                  "value": 60
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

let divDimensions = document.getElementById('familyTree').getBoundingClientRect();
let margin = {top: 20, right: 90, bottom: 30, left: 90},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      let svg = d3.select("#familyTree").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let i = 0,
        duration = 750,
        root;

      let treemap = d3.tree().size([height, width]);

      root = d3.hierarchy(data, function (d) { return d.children; });
      root.x0 = height / 2;
      root.y0 = 0;

      update(root);

      function update(source) {
        let treeData = treemap(root);
        let nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);

        nodes.forEach(function (d) {
          d.y = d.depth * 180
        });

        let node = svg.selectAll('g.node')
          .data(nodes, function (d) { return d.id || (d.id = ++i); });

        let nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr('transform', function (d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')';
          });

        nodeEnter.append('circle')
          .attr('class', 'node')
          .attr('r', 1e-6)
          .style('fill', function (d) {
            return d._children ? 'lightsteelblue' : '#fff';
          });

        nodeEnter.append('text')
          .attr('dy', '.35em')
          .attr('x', function (d) {
            return d.children || d._children ? -13 : 13;
          })
          .attr('text-anchor', function (d) {
            return d.children || d._children ? 'end' : 'start';
          })
          .text(function (d) { return d.data.name; });

        let nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
          .duration(duration)
          .attr('transform', function (d) {
            return 'translate(' + d.y + ',' + d.x + ')';
          });

        nodeUpdate.select('circle.node')
          .attr('r', 10)
          .style('fill', function (d) {
            return d._children ? 'lightsteelblue' : '#fff';
          })
          .attr('cursor', 'pointer');

        let nodeExit = node.exit().transition()
          .duration(duration)
          .attr('transform', function (d) {
            return 'translate(' + source.y + ',' + source.x + ')';
          })
          .remove();

        nodeExit.select('circle')
          .attr('r', 1e-6);

        nodeExit.select('text')
          .style('fill-opacity', 1e-6);

        let link = svg.selectAll('path.link')
          .data(links, function (d) { return d.id; });

        let linkEnter = link.enter().insert('path', 'g')
          .attr('class', 'link')
          .attr('d', function (d) {
            let o = {x: source.x0, y: source.y0};
            return diagonal(o, o)
          });

        let linkUpdate = linkEnter.merge(link);

        linkUpdate.transition()
          .duration(duration)
          .attr('d', function (d) { return diagonal(d, d.parent) });

        let linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', function (d) {
            let o = {x: source.x, y: source.y};
            return diagonal(o, o)
          })
          .remove();

        nodes.forEach(function (d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });

        function diagonal(s, d) {
          path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`
          return path
        }
      }
}
