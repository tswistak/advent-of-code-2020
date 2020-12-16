const { once } = require('events');
const fs = require('fs');
const readline = require('readline');

(async () => {
  const rd = readline.createInterface({
    input: fs.createReadStream(__dirname + '/data.txt'),
    output: process.stdout,
    console: false
  });

  let data = [];

  rd.on('line', line => data.push(line));

  await once(rd, 'close');
  
  const numbers = new Set();
  const numberSets = new Map();

  for (const line of data) {
    if (!line) {
      break;
    }

    const [name, nums] = line.split(': ');
    const lineNums = nums.split(' or ').map(x => x.split('-')).flat().map(x => parseInt(x));
    const currentSet = new Set();
    for (let i = lineNums[0]; i <= lineNums[1]; i++) {
      numbers.add(i);
      currentSet.add(i);
    }
    for (let i = lineNums[2]; i <= lineNums[3]; i++) {
      numbers.add(i);
      currentSet.add(i);
    }

    numberSets.set(name, currentSet);
  }

  const nearbyIndex = data.indexOf('nearby tickets:') + 1;

  let errors = 0;
  const goodTickets = [];
  for (let i = nearbyIndex; i < data.length; i++) {
    const lineNums = data[i].split(',').map(x => parseInt(x));
    const wrong = lineNums.filter(x => !numbers.has(x));
    if (wrong.length > 0) {
      errors += wrong.reduce((a, v) => a + v);
    } else {
      goodTickets.push(lineNums);
    }
  }

  const myTicket = data[data.indexOf('your ticket:') + 1].split(',').map(x => parseInt(x));
  goodTickets.push(myTicket);
  
  const candidates = new Map();
  for (const [name, numbers] of numberSets.entries()) {
    const indexes = new Set();
    for (let i = 0; i < goodTickets[0].length; i++) {
      const allAtCurrent = goodTickets.map(x => x[i]);
      if (allAtCurrent.every(x => numbers.has(x))) {
        indexes.add(i);
      }
    }
    candidates.set(name, indexes);
  }

  // filter candidates even more to know exact index for every
  // after this step we should have just one index for each candidate so no need to do the search
  const checked = new Set();
  while (checked.size < candidates.size) {
    const next = [...candidates.entries()].filter(x => !checked.has(x[0])).find(x => x[1].size === 1);
    const value = [...next[1].values()][0];
    if (!next) break;
    [...candidates.entries()].filter(x => x[0] !== next[0]).forEach(x => x[1].delete(value));
    checked.add(next[0]);
  }

  let departures = 1;
  for (const [name, indexes] of candidates.entries()) {
    if (!name.includes('departure')) continue;
    const index = [...indexes.values()][0];
    departures *= myTicket[index];
  }

  console.log('errors (pt 1)', errors);
  console.log('departures (pt 2)', departures);
})();