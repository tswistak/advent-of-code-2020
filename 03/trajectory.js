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

  rd.on('line', line => data.push(Array.from(line)));

  await once(rd, 'close');

  const right = 3;
  const down = 1;
  const limit = data[0].length;
  let i = 0, j = 0;
  let trees = 0;

  while (i < data.length) {
    const current = data[i][j];
    if (current === '#') {
      trees++;
    }

    i += down;
    j = (j + right) % limit;
  }

  console.log('Trees', trees);
})();