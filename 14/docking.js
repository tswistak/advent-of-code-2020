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

  rd.on('line', line => data.push(line.split(' = ')));

  await once(rd, 'close');
  
  function toBinary(value) {
    const result = [];
    while (value > 0) {
      const remainder = value % 2;
      value = Math.floor(value / 2);
      result.unshift(remainder);
    }
    // pad with zeros
    while (result.length < 36) {
      result.unshift(0);
    }
    return result;
  }

  function toDecimal(value) {
    let result = 0;
    const reversed = value.reverse();
    for (let i = 0; i < reversed.length; i++) {
      const current = reversed[i];
      if (current === 0) {
        continue;
      }

      result += 2**i;
    }
    return result;
  }

  function applyMask(mask, value) {
    const result = [...value];
    for (let i = 0; i < mask.length; i++) {
      const current = mask[i];
      if (current === 'X') {
        continue;
      }
      result[i] = parseInt(current);
    }

    return result;
  }

  const memory = new Map();
  let mask = [];

  for (const [instruction, value] of data) {
    if (instruction === 'mask') {
      mask = [...value];
    } else {
      const address = instruction.match(/mem\[(\d+)\]/)[1];
      memory.set(address, applyMask(mask, toBinary(value)));
    }
  }

  const sum = [...memory.values()].reduce((acc, val) => acc + toDecimal(val), 0);

  console.log('sum', sum);
})();