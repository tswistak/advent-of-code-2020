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

  rd.on('line', line => data.push([...line]));

  await once(rd, 'close');
  
  function checkIfCanBeOccupied(x, y) {
    for (let i = x - 1; i <= x + 1 && i < data.length; i++) {
      if (i < 0) continue;
      for (let j = y - 1; j <= y + 1 && j < data[i].length; j++) {
        if (j < 0) continue;
        if (i === x && j === y) continue;
        if (data[i][j] === '#') {
          return false;
        }
      }
    }
    return true;
  } 

  function checkIfCanBeEmpty(x, y) {
    let counter = 0;
    for (let i = x - 1; i <= x + 1 && i < data.length; i++) {
      if (i < 0) continue;
      for (let j = y - 1; j <= y + 1 && j < data[i].length; j++) {
        if (j < 0) continue;
        if (i === x && j === y) continue;
        if (data[i][j] === '#') {
          counter++;
        }
      }
    }
    return counter >= 4;
  }

  while (true) {
    const previous = JSON.parse(JSON.stringify(data));
    const newState = JSON.parse(JSON.stringify(data));

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const current = data[i][j];
        if (current === 'L' && checkIfCanBeOccupied(i, j)) {
          newState[i][j] = '#';
        } else if (current === '#' && checkIfCanBeEmpty(i, j)) {
          newState[i][j] = 'L';
        }
      }
    }

    data = newState;
    if (JSON.stringify(data) === JSON.stringify(previous)){
      break;
    }
  }

  const occupied = data.flat().filter(x => x === '#').length;

  console.log('occupied', occupied);
})();