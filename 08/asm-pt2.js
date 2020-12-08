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

  let acc = 0;
  let i = 0;
  let j = 0;
  while (j < data.length) {
    // find place to repair
    while (true) {
      const [instruction] = data[j];
      if (instruction === 'acc') {
        j++;
      } else if (instruction === 'jmp') {
        data[j][0] = 'nop';
        break;
      } else if (instruction === 'nop') {
        data[j][0] = 'jmp';
        break;
      }
    }

    acc = 0;
    i = 0;
    const counter = new Map();
    data.forEach((_, i) => counter.set(i, 0));
    // check
    while (i >= 0 && i < data.length) {
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

    if (i >= data.length) {
      break;
    } else {
      // revert
      if (data[j][0] === 'jmp') {
        data[j][0] = 'nop';
      } else if (data[j][0] === 'nop') {
        data[j][0] = 'jmp';
      }
      j++;
    }
  }

  console.log('acc', acc);
})();