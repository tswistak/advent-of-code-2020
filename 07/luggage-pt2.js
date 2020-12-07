const { once } = require('events');
const fs = require('fs');
const readline = require('readline');

(async () => {
  const rd = readline.createInterface({
    input: fs.createReadStream(__dirname + '/data.txt'),
    output: process.stdout,
    console: false
  });

  const data = new Map();

  rd.on('line', line => {
    const [name, bags] = line.slice(0, -1).split(' contain ');
    let neighbors = [];
    if (bags !== 'no other bags') {
      const splittedBags = bags.split(', ');
      neighbors = splittedBags.map(x => { 
        let name = x.match(/\D+/)[0].slice(1);
        if (!name.includes('bags')) {
          name += 's';
        };
        const count = parseInt(x.match(/\d+/));
        return [count, name];
      });
    }
    data.set(name, {
      name: name,
      text: line,
      neighborsName: neighbors,
    });
  });

  await once(rd, 'close');

  // do a graph from the data
  for (const bag of data.values()) {
    bag.neighbors = bag.neighborsName.map(x => [x[0], data.get(x[1])]);
  }

  function count(node) {
    if (node.neighbors.length === 0) {
      return 0;
    } else {
      let sum = 0;
      for (const [weight, neighbor] of node.neighbors) {
        sum += weight + weight * count(neighbor);
      }
      return sum;
    }
  }

  const bags = count(data.get('shiny gold bags'));
  console.log('Bags inside', bags);
})();