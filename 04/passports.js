const { once } = require('events');
const fs = require('fs');
const readline = require('readline');

(async () => {
  const rd = readline.createInterface({
    input: fs.createReadStream(__dirname + '/data.txt'),
    output: process.stdout,
    console: false
  });

  const data = [{}];

  rd.on('line', line => {
    if (line === '') {
      data.push({});
      return;
    }
    const passport = data[data.length - 1];
    const fields = line.split(' ').map(x => x.split(':'));
    data[data.length - 1] = {
      ...passport,
      ...Object.fromEntries(fields),
    };
  });

  await once(rd, 'close');

  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  let valid = 0;

  for (const passport of data) {
    const passKeys = Object.keys(passport);
    let isValid = true;
    for (const field of requiredFields) {
      if (!passKeys.includes(field)) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      valid++;
    }
  }

  console.log('Passports', data.length);
  console.log('Valid passports', valid);
})();