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
        return name;
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
    bag.neighbors = bag.neighborsName.map(x => data.get(x));
  }

  function graphSearch(node, searched) {
    let result = 0;
    if (node.name === searched) {
      // match
      return 1;
    } else if (node.neighbors.length === 0) {
      // can't go further
      return 0;
    } else if (node.neighborsName.includes(searched)) {
      // flattening recursion if there is searched one
      return 1;
    } else {
      // going deeper
      for (const neighbor of node.neighbors) {
        result += graphSearch(neighbor, searched);
      }
      return result;
    }
  }

  const canHave = [...data.values()].map(x => graphSearch(x, 'shiny gold bags') > 0);
  const howMany = canHave.filter(x => x).length - 1;

  console.log('Can have gold bag: ', howMany);
})();