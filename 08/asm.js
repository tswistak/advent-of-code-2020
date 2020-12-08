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

  rd.on('line', line => data.push(line.split(' ')));

  await once(rd, 'close');

  const counter = new Map();
  data.forEach((_, i) => counter.set(i, 0));

  let acc = 0;
  let i = 0;
  while (i < data.length) {
    if (counter.get(i) === 1) {
      break;
    }
    counter.set(i, 1);

    const instruction = data[i][0];
    const number = parseInt(data[i][1]);

    if (instruction === 'acc') {
      i++;
      acc += number;
    } else if (instruction === 'nop') {
      i++;
    } else if (instruction === 'jmp') {
      i += number;
    }
  }

  console.log('acc', acc);
})();