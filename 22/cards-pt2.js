const fs = require('fs');

const data = fs.readFileSync(__dirname + '/data.txt', 'utf8').split('\n\n');

const player1Data = data[0].split('\n').filter((_, i) => i > 0).map(x => parseInt(x));
const player2Data = data[1].split('\n').filter((_, i) => i > 0).map(x => parseInt(x));

function deepCopy(a) {
  return JSON.parse(JSON.stringify(a));
}

function getHash(a) {
  return a.reduce((acc, val, i) => val * (a.length - i) + acc, 0);
}

function getStr(a) {
  return JSON.stringify(a);
}

function playGame(player1, player2, depth = 0) {
  const prevRounds1 = new Set();
  const prevRounds2 = new Set();
  while (player1.length > 0 && player2.length > 0) {
    const p1Str = getStr(player1);
    const p2Str = getStr(player2);
    if (prevRounds1.has(p1Str) || prevRounds2.has(p2Str)) {
      return { winner: 1, cards: player1 };
    }
    prevRounds1.add(p1Str);
    prevRounds2.add(p2Str);

    const p1 = player1.shift();
    const p2 = player2.shift();
    if (p1 <= player1.length && p2 <= player2.length) {
      const { winner } = playGame(deepCopy(player1).slice(0, p1), deepCopy(player2).slice(0, p2), depth + 1);
      if (winner === 1) {
        player1.push(p1);
        player1.push(p2);
      } else {
        player2.push(p2);
        player2.push(p1);
      }
    } else if (p1 > p2) {
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

  return player1.length === 0 ? { winner: 2, cards: player2 } : { winner: 1, cards: player1 };
}

const { cards } = playGame(player1Data, player2Data);
const result = getHash(cards);

console.log('result', result);