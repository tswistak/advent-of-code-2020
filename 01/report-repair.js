const { once } = require('events');
const fs = require('fs');
const readline = require('readline');

(async () => {
  const rd = readline.createInterface({
    input: fs.createReadStream(__dirname + '/data.txt'),
    output: process.stdout,
    console: false
  });

  const data = [];

  rd.on('line', line => data.push(parseInt(line)));

  await once(rd, 'close');

  let match;
  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    for (let j = 0; j < data.length; j++) {
      if (i === j) continue;
      const toCompare = data[j];

      if (current + toCompare === 2020) {
        match = [current, toCompare];
        break;
      }
    }
    if (match) {
      break;
    }
  }

  console.log('Match', match);
  console.log('Multiplied', match[0] * match[1]);
})();