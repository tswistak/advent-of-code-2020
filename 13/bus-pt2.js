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
  
  const buses = data[1].split(',');

  function modularInverse(a, mod) {
    const b = a % mod;
    for (let x = 1n; x < mod; x += 1n) {
      if ((b * x) % mod === 1n) {
        return x;
      }
    }
    return 1n;
  }

  function crt(congruences) {
    const product = congruences.reduce((acc, val) => acc * val[0], BigInt(1));

    let sum = 0n;
    for (const [ni, ai] of congruences) {
      const div = product / ni;
      sum += ai * modularInverse(div, ni) * div;
    }

    return sum % product;
  }

  const congruences = [];

  for (let i = 0; i < buses.length; i++) {
    const current = parseInt(buses[i]);
    if (Number.isNaN(current)) {
      continue;
    }

    congruences.push([BigInt(current), BigInt(current - i)]);
  }

  const result = crt(congruences);

  console.log('result', result);
})();