const fs = require('fs');

const data = fs.readFileSync(__dirname + '/data.txt', 'utf8').split('\n\n');

const player1 = data[0].split('\n').filter((_, i) => i > 0).map(x => parseInt(x));
const player2 = data[1].split('\n').filter((_, i) => i > 0).map(x => parseInt(x));

while (player1.length > 0 && player2.length > 0) {
  const p1 = player1.shift();
  const p2 = player2.shift();

  if (p1 > p2) {
    player1.push(p1);
    player1.push(p2);
  } else if (p1 < p2) {
    player2.push(p2);
    player2.push(p1);
  } else {
    player1.push(p1);
    player2.push(p2);
  }
}

const winner = player1.length === 0 ? player2 : player1;
const result = winner.reduce((acc, val, i) => val * (winner.length - i) + acc, 0);

console.log('result', result);