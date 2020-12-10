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
  sortedData = [0, ...sortedData];
  
  const arrangements = [...new Array(sortedData.length)].map(() => 0);
  arrangements[0] = 1;

  for (let i = 1; i < sortedData.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (sortedData[i] - sortedData[j] <= 3) {        
        arrangements[i] += arrangements[j];
      }
    }
  }

  const result = arrangements[arrangements.length - 1];

  console.log('result', result);
})();