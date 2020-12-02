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
    const [min, max] = policy[0].split('-').map(x => parseInt(x));
    const char = policy[1].slice(0, -1);
    const password = policy[2];

    const occurences = (password.match(new RegExp(char, "g")) || []).length;

    if (occurences >= min && occurences <= max) {
      valid++;
    }
  }

  console.log('Valid passwords', valid);
})();