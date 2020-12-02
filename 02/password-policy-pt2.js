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

  let valid = 0;
  for (const policy of data) {
    const [first, second] = policy[0].split('-').map(x => parseInt(x) - 1);
    const char = policy[1].slice(0, -1);
    const password = policy[2];

    const isOnFirst = password[first] === char;
    const isOnSecond = password[second] === char;

    if ((isOnFirst || isOnSecond) && !(isOnFirst && isOnSecond)) {
      console.log(isOnFirst, isOnSecond);
      valid++;
    }
  }

  console.log('Valid passwords', valid);
})();