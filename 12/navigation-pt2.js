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
  const ship = [0, 0];
  const waypoint = [10, 1];

  for (let [direction, length] of data) {
    let rotates = length / 90;
    switch (direction) {
      case 'N':
        waypoint[1] += length;
        break;
      case 'S':
        waypoint[1] -= length;
        break;
      case 'E':
        waypoint[0] += length;
        break;
      case 'W':
        waypoint[0] -= length;
        break;
      case 'R':        
        while (rotates > 0) {
          const copy = [...waypoint];
          waypoint[0] = copy[1];
          waypoint[1] = -copy[0];
          rotates--;
        }
        break;
      case 'L':
        while (rotates > 0) {
          const copy = [...waypoint];
          waypoint[0] = -copy[1];
          waypoint[1] = copy[0];
          rotates--;
        }
        break;
      case 'F':
        ship[0] += waypoint[0] * length;
        ship[1] += waypoint[1] * length;
        break;
    }
  }

  const result = Math.abs(ship[0]) + Math.abs(ship[1]);

  console.log('ship', ship);
  console.log('result', result);
})();