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
    // up-left
    for (let i = x - 1, j = y - 1; i >= 0 && j >=0; i--, j--) {
      if (data[i][j] === '#') {
        return false;
      } else if (data[i][j] === 'L') {
        break;
      }
    }
    // up
    for (let i = x - 1; i >= 0; i--) {
      if (data[i][y] === '#') {
        return false;
      } else if (data[i][y] === 'L') {
        break;
      }
    }
    // up-right
    for (let i = x - 1, j = y + 1; i >= 0 && j < data[0].length; i--, j++) {
      if (data[i][j] === '#') {
        return false;
      } else if (data[i][j] === 'L') {
        break;
      }
    }
    // right
    for (let i = y + 1; i < data[0].length; i++) {
      if (data[x][i] === '#') {
        return false;
      } else if (data[x][i] === 'L') {
        break;
      }
    }
    // bottom-right
    for (let i = x + 1, j = y + 1; i < data.length && j < data[0].length; i++, j++) {
      if (data[i][j] === '#') {
        return false;
      } else if (data[i][j] === 'L') {
        break;
      }
    }
    // bottom
    for (let i = x + 1; i < data.length; i++) {
      if (data[i][y] === '#') {
        return false;
      } else if (data[i][y] === 'L') {
        break;
      }
    }
    // bottom-left
    for (let i = x + 1, j = y - 1; i < data.length && j >= 0; i++, j--) {
      if (data[i][j] === '#') {
        return false;
      } else if (data[i][j] === 'L') {
        break;
      }
    }
    // left
    for (let i = y - 1; i >= 0; i--) {
      if (data[x][i] === '#') {
        return false;
      } else if (data[x][i] === 'L') {
        break;
      }
    }
    return true;
  } 

  function checkIfCanBeEmpty(x, y) {
    let counter = 0;
    // up-left
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
      if (data[i][j] === '#') {
        counter++;
        break;
      } else if (data[i][j] === 'L') {
        break;
      }
    }
    // up
    for (let i = x - 1; i >= 0; i--) {
      if (data[i][y] === '#') {
        counter++;
        break;
      } else if (data[i][y] === 'L') {
        break;
      }
    }
    // up-right
    for (let i = x - 1, j = y + 1; i >= 0 && j < data[0].length; i--, j++) {
      if (data[i][j] === '#') {
        counter++;
        break;
      } else if (data[i][j] === 'L') {
        break;
      }
    }
    // right
    for (let i = y + 1; i < data[0].length; i++) {
      if (data[x][i] === '#') {
        counter++;
        break;
      } else if (data[x][i] === 'L') {
        break;
      }
    }
    // bottom-right
    for (let i = x + 1, j = y + 1; i < data.length && j < data[0].length; i++, j++) {
      if (data[i][j] === '#') {
        counter++;
        break;
      } else if (data[i][j] === 'L') {
        break;
      }
    }
    // bottom
    for (let i = x + 1; i < data.length; i++) {
      if (data[i][y] === '#') {
        counter++;
        break;
      } else if (data[i][y] === 'L') {
        break;
      }
    }
    // bottom-left
    for (let i = x + 1, j = y - 1; i < data.length && j >= 0; i++, j--) {
      if (data[i][j] === '#') {
        counter++;
        break;
      } else if (data[i][j] === 'L') {
        break;
      }
    }
    // left
    for (let i = y - 1; i >= 0; i--) {
      if (data[x][i] === '#') {
        counter++;
        break;
      } else if (data[x][i] === 'L') {
        break;
      }
    }
    return counter >= 5;
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