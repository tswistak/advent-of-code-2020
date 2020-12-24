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

  rd.on('line', line => {
    data.push(line.match(/(se)|(sw)|(nw)|(ne)|(e)|(w)/g));
  });

  await once(rd, 'close');
  
  const directions = new Map([
    ['se', [0, 1]],
    ['sw', [-1, 1]],
    ['nw', [0, -1]],
    ['ne', [1, -1]],
    ['e', [1, 0]],
    ['w', [-1, 0]],    
  ]);

  const hex = new Map();
  for (const line of data) {
    const tile = [0, 0];
    for (const dir of line) {
      const move = directions.get(dir);
      tile[0] += move[0];
      tile[1] += move[1];
    }
    const current = JSON.stringify(tile);
    hex.set(current, !hex.get(current));
  }

  let black = new Set([...hex.entries()].filter(x => x[1]).map(x => x[0]));

  console.log('black part1', black.size);

  // part 2
  const neighbors = ([x, y]) => [...directions.values()].map(([x1, y1]) => [x + x1, y + y1]);

  for (let i = 1; i <= 100; i++) {
    const flipped = [...black.values()].map(x => neighbors(JSON.parse(x))).flat();
    const newBlack = [];
    for (const tile of flipped) {
      const blackNeighbors = neighbors(tile).filter(x => black.has(JSON.stringify(x))).length;
      if (blackNeighbors === 2 || (blackNeighbors === 1 && black.has(JSON.stringify(tile)))) {
        newBlack.push(tile);
      }
    }

    black = new Set(newBlack.map(x => JSON.stringify(x)));
  }

  console.log('black part2', black.size);
})();