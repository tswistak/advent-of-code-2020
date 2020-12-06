const { once } = require('events');
const fs = require('fs');
const readline = require('readline');

(async () => {
  const rd = readline.createInterface({
    input: fs.createReadStream(__dirname + '/data.txt'),
    output: process.stdout,
    console: false
  });

  const data = [[]];

  rd.on('line', line => {
    if (line === '') {
      data.push([]);
      return;
    }
    const group = data[data.length - 1];
    data[data.length - 1] = [
      ...group,
      new Set([...line]),
    ];
  });

  await once(rd, 'close');

  const intersections = data.map(x => x.reduce((acc, curr) => new Set([...acc].filter(y => curr.has(y)))))
                          .map(x => x.size);

  console.log(intersections);

  const sum = intersections.reduce((acc, curr) => acc + curr);
  
  console.log('Sum', sum);
})();