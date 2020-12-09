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
  
  let invalid = 0;
  let invalidIndex = 0;
  for (let i = 25; i < data.length; i++) {
    const number = data[i];
    const preamble = data.slice(i - 25, i);
    const isInvalid = !preamble.some(
      (x, ind1) => 
        preamble.filter((_, ind2) => ind2 !== ind1)
          .map(y => x + y)
          .includes(number)
      );
    
    if (isInvalid) {
      invalid = number;
      invalidIndex = i;
      break;
    }
  }

  console.log('invalid', invalid);
  console.log('invalidIndex', invalidIndex);

  // part 2

  let set = [];
  for (let i = 0; i < data.length; i++) {
    if (i === invalidIndex) {
      continue;
    }
    for (let j = i + 1; j < data.length; j++) {
      if (j === invalidIndex) {
        break;
      }

      const currentSlice = data.slice(i, j + 1);
      const sum = currentSlice.reduce((acc, curr) => acc + curr);

      if (sum === invalid) {
        set = currentSlice;
        break;
      }
    }
    if (set.length > 0) {
      break;
    }
  }

  const min = Math.min(...set);
  const max = Math.max(...set);
  const weakness = min + max;

  console.log('min', min);
  console.log('max', max);
  console.log('weakness', weakness);
})();