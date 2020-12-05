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
    const result = {};
    const rowStr = line.slice(0, 7);
    const colStr = line.slice(7);

    let rowRange = [0, 127];
    for (const letter of rowStr) {
      if (letter === 'F') {
        const half = Math.floor((rowRange[0] + rowRange[1]) / 2);
        rowRange = [rowRange[0], half];
      } else {
        const half = Math.ceil((rowRange[0] + rowRange[1]) / 2);
        rowRange = [half, rowRange[1]];
      }
    }
    result.row = rowRange[0];
    
    let colRange = [0, 7];
    for (const letter of colStr) {
      if (letter === 'L') {
        const half = Math.floor((colRange[0] + colRange[1]) / 2);
        colRange = [colRange[0], half];
      } else {
        const half = Math.ceil((colRange[0] + colRange[1]) / 2);
        colRange = [half, colRange[1]];
      }
    }
    result.col = colRange[0];
    result.id = result.row * 8 + result.col;

    data.push(result);
  });

  await once(rd, 'close');

  const max = Math.max(...data.map(x => x.id));
  console.log('Max id', max);

  // part 2
  const seatMap = [...new Array(8)].map(() => new Array(128));
  for (const ticket of data) {
    seatMap[ticket.col][ticket.row] = ticket.id;
  }
  const idSet = new Set(data.map(x => x.id));

  const missingSeats = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 128; j++) {
      if (typeof seatMap[i][j] !== 'undefined') continue;
      missingSeats.push({
        col: i,
        row: j,
        id: j * 8 + i
      });
    }
  }

  for (const seat of missingSeats) {
    const hasLowerId = idSet.has(seat.id - 1);
    const hasHigherId = idSet.has(seat.id + 1);

    if (hasLowerId && hasHigherId) {
      console.log('Seat', seat.id);
      break;
    }
  }
})();