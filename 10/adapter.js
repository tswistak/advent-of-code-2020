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

  rd.on('line', line => data.push(parseInt(line)));

  await once(rd, 'close');
  
  let sortedData = data.sort((x, y) => x - y);
  sortedData = [0, ...sortedData, sortedData[sortedData.length - 1] + 3];

  let oneDiff = 0;
  let threeDiff = 0;

  for (let i = 1; i < sortedData.length; i++) {
    const diff = sortedData[i] - sortedData[i - 1];
    if (diff === 1) {
      oneDiff++;
    } else if (diff === 3) {
      threeDiff++;
    }
  }

  console.log('one', oneDiff);
  console.log('three', threeDiff);
  console.log('multiplied', oneDiff * threeDiff);
})();