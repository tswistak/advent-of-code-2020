const test = '0,3,6';
const real = '6,4,12,1,20,0,16';

const data = real.split(',').map(x => parseInt(x));

function recitate(limit) {
  const spoken = new Map(data.slice(0, data.length - 1).map((x, i) => [x, i + 1]));

  let lastNum = data[data.length - 1];
  for (let i = data.length; i < limit; i++) {
    const lastUsed = spoken.get(lastNum);
    let newNumber;
    if (typeof lastUsed === 'undefined') {
      newNumber = 0;
    } else {
      newNumber = i - lastUsed;
    }

    spoken.set(lastNum, i);
    lastNum = newNumber;
  }

  console.log(limit, lastNum);
}

recitate(2020);
recitate(30000000);