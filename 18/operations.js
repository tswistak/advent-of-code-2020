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

  rd.on('line', line => data.push(line.replaceAll(')', ' )').replaceAll('(', '( ').split(' ')));

  await once(rd, 'close');

  const getPriority = (char, isPart2) => {
    if (isPart2) {
      switch (char) {
        case '+': return 2;
        case '*': return 1;
        default: return 0;
      }
    } else {
      return char === '+' || char === '*' ? 1 : 0;
    }
  }

  function lineToRpn(line, isPart2) {
    const stack = [];
    const output = [];

    for (const char of line) {
      switch (char) {
        case '(': 
          stack.push(char);
          break;
        case ')': 
          while (stack[stack.length - 1] !== '(') {
            output.push(stack.pop());
          }
          stack.pop();
          break;
        case '+':
        case '*':
          while (stack.length > 0) {
            if (getPriority(char, isPart2) > getPriority(stack[stack.length - 1], isPart2)) break;
            output.push(stack.pop());
          }
          stack.push(char);
          break;
        default:
          output.push(parseInt(char));
      }
    }

    while (stack.length > 0) {
      output.push(stack.pop());
    }

    return output;
  }

  function solveRpn(line) {
    const stack = [];
    let right, left;

    for (const char of line) {
      switch (char) {
        case '+':
          right = stack.pop();
          left = stack.pop();
          stack.push(left + right);
          break;
        case '*':
          right = stack.pop();
          left = stack.pop();
          stack.push(left * right);
          break;
        default:
          stack.push(char);
      }
    }

    return stack.pop();
  }

  let sumPart1 = 0;
  let sumPart2 = 0;
  for (const line of data) {
    const rpnLine1 = lineToRpn(line, false);
    const rpnLine2 = lineToRpn(line, true);
    sumPart1 += solveRpn(rpnLine1);
    sumPart2 += solveRpn(rpnLine2);
  }

  console.log('sum part 1', sumPart1);
  console.log('sum part 2', sumPart2);
})();