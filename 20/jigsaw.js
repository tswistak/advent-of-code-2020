const fs = require('fs');

const data = fs.readFileSync(__dirname + '/data.txt', 'utf8').split('\n\n');

function rotate(array) {
  const result = JSON.parse(JSON.stringify(array));
  const n = array.length;
  for (let i = 0; i < n / 2; i++) {
    for (let j = i; j < n - i - 1; j++) {
      result[i][j] = array[n - 1 - j][i];
      result[n - 1 - j][i] = array[n - 1 - i][n - 1 - j];
      result[n - 1 - i][n - 1 - j] = array[j][n - 1 - i];
      result[j][n - 1 - i] = array[i][j];
    }
  }
  return result;
}

function flipVertical(array) {
  return JSON.parse(JSON.stringify(array)).reverse();
}

function flipHorizontal(array) {
  const result = JSON.parse(JSON.stringify(array));
  for (let i = 0; i < array.length; i++) {
    result[i] = result[i].reverse();
  }
  return result;
}

function repeat(count, func) {
  return (arg) => {
    let lastResult = arg;
    for (let i = 0; i < count; i++) {
      lastResult = func(lastResult);
    }
    return lastResult;
  }
} 

const tiles = new Map();
const neighbors = new Map();
for (const tile of data) {
  const splitted = tile.split('\n');
  const name = parseInt(splitted[0].match(/^Tile (\d+):$/)[1]);
  const contents = splitted.slice(1).filter(x => x.length > 0).map(x => [...x]);
  const result = new Set();
  for (let i = 0; i < 4; i++) {
    const rotated = repeat(i, rotate)(contents);
    result.add(JSON.stringify(rotated));
    result.add(JSON.stringify(flipHorizontal(rotated)));
    result.add(JSON.stringify(flipVertical(rotated)));
    result.add(JSON.stringify(flipVertical(flipHorizontal(rotated))));
  }
  tiles.set(name, [...result.values()].map(x => JSON.parse(x)));
}

let debug = false;

function compare(a, b) {
  if (debug) console.log(JSON.stringify(a), JSON.stringify(b));
  return JSON.stringify(a) === JSON.stringify(b)
}

function getRightBorder(a) {
  return a.map(x => x[x.length - 1]);
}

function getLeftBorder(a) {
  return a.map(x => x[0]);
}

function isCorner(tileKey) {
  const current = tiles.get(tileKey);
  console.log(tileKey);
  // debug = tileKey === 2473;
  for (const variant of current) {
    let borders = [false, false, false, false]; // 0 - top, 1 - right, 2 - bottom, 3 - left
    for (const [key, otherTile] of tiles.entries()) {
      if (key === tileKey) continue;
      for (const otherTileVariants of otherTile) {
        if (compare(otherTileVariants[otherTileVariants.length - 1], variant[0])) {
          borders[0] = key;
          break;
        };
        if (compare(getLeftBorder(otherTileVariants), getRightBorder(variant))) {
          borders[1] = key;
          break;
        }
        if (compare(otherTileVariants[0], variant[variant.length - 1])) {
          borders[2] = key;
          break;
        }
        if (compare(getRightBorder(otherTileVariants), getLeftBorder(variant))) {
          borders[3] = key;
          break;
        }        
        if (debug) console.log('-');
      }      
      if (debug) console.log('---');
    }   
    neighbors.set(tileKey, borders.filter(x => x));
    if (borders.filter(x => x).length > 2) {      
      return false;
    }
  }

  return true;
}

const corners = [];
for (const tile of tiles.keys()) {
  if (isCorner(tile)) { 
    corners.push(tile);
  }
}

console.log(corners);
console.log('part 1:', corners.reduce((a, b) => a * b));

