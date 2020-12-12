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

  rd.on('line', line => {
    const direction = line.slice(0, 1);
    const length = parseInt(line.slice(1));
    data.push([direction, length]);
  });

  await once(rd, 'close');
  
  const dirs = ['N', 'E', 'S', 'W'];
  const revDirs = ['W', 'S', 'E', 'N'];

  let north = 0;
  let south = 0;
  let east = 0;
  let west = 0;
  let current = 'E';

  for (let [direction, length] of data) {
    if (direction === 'F') {
      direction = current;
    }
    switch (direction) {
      case 'N':
        north += length;
        break;
      case 'S':
        south += length;
        break;
      case 'E':
        east += length;
        break;
      case 'W':
        west += length;
        break;
      case 'R':
        current = dirs[(dirs.indexOf(current) + length / 90) % 4];
        break;
      case 'L':
        current = revDirs[(revDirs.indexOf(current) + length / 90) % 4];
        break;
    }
  }

  const result = Math.abs(north - south) + Math.abs(east - west);

  console.log('north', north);
  console.log('east', east);
  console.log('south', south);
  console.log('west', west);
  console.log('result', result);
})();