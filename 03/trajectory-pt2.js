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

  const slopes = [{ right: 1, down: 1 }, { right: 3, down: 1 }, { right: 5, down: 1 }, { right: 7, down: 1 }, { right: 1, down: 2 }];
  const limit = data[0].length;
  const result = [];

  for (const { right, down } of slopes) {    
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

    result.push(trees);
  }
  const product = result.reduce((acc, x) => acc * x);

  console.log('Trees', result);
  console.log('Product', product);
})();