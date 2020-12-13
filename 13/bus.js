const { once } = require('events');
const fs = require('fs');
const readline = require('readline');

(async () => {
  const rd = readline.createInterface({
    input: fs.createReadStream(__dirname + '/data.txt'),
    output: process.stdout,
    console: false
  });

  let data = [];

  rd.on('line', line => data.push(line));

  await once(rd, 'close');
  
  const timestamp = parseInt(data[0]);
  const buses = data[1].split(',').map(x => parseInt(x)).filter(x => !Number.isNaN(x));

  let currentClosestBus = null;
  let currentClosestBusTime = Number.POSITIVE_INFINITY;

  for (const bus of buses) {
    const closest = Math.ceil(timestamp / bus) * bus;
    if (closest < currentClosestBusTime) {
      currentClosestBusTime = closest;
      currentClosestBus = bus;
    }
  }

  const toWait = currentClosestBusTime - timestamp;
  const result = currentClosestBus * toWait;

  console.log('bus time', currentClosestBus, currentClosestBusTime);
  console.log('timestamp toWait', timestamp, toWait);
  console.log('result', result);
})();