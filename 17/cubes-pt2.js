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

  rd.on('line', line => data.push([...line]));

  await once(rd, 'close');

  const CYCLES = 6;

  // our 4d-array will be a map representing sparse matrix
  const getKey = (x, y, z, w) => `${x},${y},${z},${w}`;
  const getCoords = (key) => key.split(',').map(x => parseInt(x));

  // to make things easier we will assume that every non-existing key is equal zero
  // we will only do +1 and -1 operations
  const addValue = (x, y, z, w, map) => {
    const key = getKey(x, y, z, w);
    const current = map.get(key) || 0;
    map.set(key, current + 1);
  };
  const subtractValue = (x, y, z, w, map) => {
    const key = getKey(x, y, z, w);
    const current = map.get(key) || 0;
    map.set(key, current - 1);
  };
  
  const initialState = new Map();

  // do initial state out of data
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === '#') {
        initialState.set(getKey(i, j, 0, 0), 1);
      }
    }
  }
  
  let currentState = new Map([...initialState.entries()]);

  for (let cycle = 0; cycle < CYCLES; cycle++) {
    const neighbors = new Map();
    const newState = new Map();
    // calculate neighbors for each field
    for (const key of currentState.keys()) {
      const [x, y, z, w] = getCoords(key);
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          for (let k = z - 1; k <= z + 1; k++) {
            for (let l = w - 1; l <= w + 1; l++) {
              addValue(i, j, k, l, neighbors);
            }
          }
        }
      }
      subtractValue(x, y, z, w, neighbors);
    }
    // create new state
    for (const [key, value] of neighbors.entries()) {
      const [x, y, z, w] = getCoords(key);
      if (value === 3 || (value === 2 && currentState.has(key))) {
        addValue(x, y, z, w, newState);
      }
    }
    currentState = newState;
  }

  const active = currentState.size;

  console.log('active', active);
})();