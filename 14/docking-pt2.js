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

  function replaceX(values) {
    const result = [];
    let hasChanged = false;
    for (const value of values) {
      const i = value.findIndex(x => Number.isNaN(x));
      if (i >= 0) {
        const copy1 = [...value];
        const copy2 = [...value];
        copy1[i] = 0;
        copy2[i] = 1;
        result.push(copy1, copy2);
        hasChanged = true;
      } else {
        result.push(value);
      }
    }
    return hasChanged ? replaceX(result) : result;
  }

  function applyMask(mask, value) {
    const temp = [...value];
    for (let i = 0; i < mask.length; i++) {
      const current = mask[i];
      if (current === '0') {
        continue;
      }
      temp[i] = parseInt(current);
    }

    const result = replaceX([temp]);
    return result;
  }

  const memory = new Map();
  let mask = [];

  for (const [instruction, value] of data) {
    if (instruction === 'mask') {
      mask = [...value];
    } else {
      const address = instruction.match(/mem\[(\d+)\]/)[1];
      const allAddresses = applyMask(mask, toBinary(address)).map(x => toDecimal(x));
      allAddresses.forEach(x => memory.set(x, parseInt(value)));
    }
  }

  const sum = [...memory.values()].reduce((acc, val) => acc + val);

  console.log('sum', sum);
})();