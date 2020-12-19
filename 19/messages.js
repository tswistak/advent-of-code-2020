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

  rd.on('line', line => data.push(line));

  await once(rd, 'close');

  const breakIndex = data.indexOf('');

  const rules = new Map(data.filter((_, i) => i < breakIndex).map(x => {
    const firstSplit = x.split(': ');
    const index = parseInt(firstSplit[0]);
    const rules = firstSplit[1].split(' | ').map(x => x === '"a"' ? 'a' : x === '"b"' ? 'b' : x.split(' ').map(y => parseInt(y)));
    return [index, rules];
  }));

  const messages = data.filter((_, i) => i > breakIndex);
  const firstRuleIndex = Math.min(...rules.keys());
  const depthLimit = 25;

  function doTask() {
    function generateRegex(key, depth = 0) {
      if (depth > depthLimit) { 
        return '';
      }
      
      const rule = rules.get(key);
      if (typeof rule[0] === "string") {
        return rule[0];
      }

      return `(${rule.map(x => x.map(y => generateRegex(y, depth + 1)).join('')).join('|')})`;
    }

    const regex = new RegExp('^' + generateRegex(firstRuleIndex) + '$');
    return messages.filter(x => regex.test(x)).length;
  }

  console.log('part 1:', doTask());

  rules.set(8, [[42], [42, 8]]);
  rules.set(11, [[42, 31], [42, 11, 31]]);
  console.log('part 2:', doTask());
})();