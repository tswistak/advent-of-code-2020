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

  let valid = 0;

  for (const passport of data) {
    if (!passport.byr || parseInt(passport.byr) < 1920 || parseInt(passport.byr) > 2002) continue;
    if (!passport.iyr || parseInt(passport.iyr) < 2010 || parseInt(passport.iyr) > 2020) continue;
    if (!passport.eyr || parseInt(passport.eyr) < 2020 || parseInt(passport.eyr) > 2030) continue;
    if (!passport.hgt) {
       continue;
    } else {
      const unit = passport.hgt.slice(-2);
      const height = parseInt(passport.hgt.slice(0, -2));
      if (unit !== 'cm' && unit !== 'in') {
        continue;
      } else if (unit === 'cm' && (height < 150 || height > 193)) {
        continue;
      } else if (unit === 'in' && (height < 59 || height > 76)) {
        continue;
      }
    }
    if (!passport.hcl || !/^#[a-f0-9]{6}$/.test(passport.hcl)) continue;
    if (!passport.ecl || !['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl)) continue;
    if (!passport.pid || !/^[0-9]{9}$/.test(passport.pid)) continue;
    
    valid++;    
  }

  console.log('Passports', data.length);
  console.log('Valid passports', valid);
})();