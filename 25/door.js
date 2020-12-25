const fs = require('fs');
const [cardKey, doorKey] = fs.readFileSync(__dirname + '/data.txt', 'utf8').split('\n').map(x => parseInt(x));
const SUBJECT = 7;

function findLoopSize(target) {  
  let loopSize = 0;
  let current = 1;
  while (current !== target) {
    current = current * SUBJECT % 20201227;
    loopSize++;
  }
  return loopSize;
}

const loopSize = findLoopSize(doorKey);

let encryptionKey = 1;
for (let i = 0; i < loopSize; i++) {
  encryptionKey = encryptionKey * cardKey % 20201227;
}

console.log('encryptionKey', encryptionKey);