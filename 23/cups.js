const data = "247819356";
const cupsArray = [...data].map(x => parseInt(x));

let firstNode;
let debug = false;
class LinkedListNode {
  prev = null;
  next = null;
  value = undefined;

  constructor(value) {
    if (value instanceof LinkedListNode) {
      this.value = value.value;
    } else {
      this.value = value;
    }
  }

  get nextCircular() {
    return this.next || firstNode;
  }
}

class LinkedList {
  first = null;

  constructor(array) {
    if (array && Array.isArray(array)) {
      this.addRange(array);
    }
  }

  remove(node) {
    let current = this.first;
    while (current !== node) {
      // debug && console.log('looking', current.value);
      current = current.next;
    }
    if (current.prev) {
      // debug && console.log('set prev-next', current.prev.value);
      debug && console.log(current);
      current.prev.next = current.next;
    } else {
      // debug && console.log('looking', current.value);
      this.first = current.next;
      firstNode = this.first;
    }
    if (current.next) {
      // debug && console.log('set next-prev', current.next.value);
      current.next.prev = current.prev;
    }
    node.prev = null;
    node.next = null;
  }

  add(node) {
    if (!this.first) {
      this.first = node;
      firstNode = this.first;
    } else {
      let current = this.first;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
      node.prev = current;
      node.next = null;
    }
  }

  addAfter(node, nodeToAdd) {
    nodeToAdd.next = node.next;
    node.next = nodeToAdd;
    nodeToAdd.prev = node;
    if (nodeToAdd.next) {
      nodeToAdd.next.prev = nodeToAdd;
    }
  }

  addRange(array) {
    const nodes = array.map(x => new LinkedListNode(x));
    if (!this.first) {
      this.add(nodes.shift());
    }
    let current = this.first;
    while (current.next) {
      current = current.next;
    }
    for (const node of nodes) {
      current.next = node;
      node.prev = current;
      current = node;
    }
  }

toString() {
    const result = [];
    let current = this.first;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return JSON.stringify(result);
  }
}

function play(cups, rounds) {
  // fast lookup of nodes
  const cupsMap = new Map();
  let cup = cups.first;
  while (cup) {
    cupsMap.set(cup.value, cup);
    cup = cup.next;
  }
  // actual game
  let current = cups.first;
  for (let i = 0; i < rounds; i++) {
    // console.log(i, cups.toString());
    console.log(i);
    // debug = i === 12;
    // get pickup
    const pickup = [current.nextCircular, current.nextCircular.nextCircular, current.nextCircular.nextCircular.nextCircular];
    // console.log(pickup.map(x=>x.value));
    // remove pickup from list
    pickup.forEach(x => cups.remove(x));
    // console.log('list without pickups', cups.toString());
    // get destination
    let destination = current.value;
    // console.log('destination', destination);
    do {
      destination--;
      if (destination === 0) {
        destination = 9;
      }
      // console.log('new dest', destination);
    } while(pickup.some(x => x.value === destination))
    // do new list
    current = current.nextCircular;
    let target = cupsMap.get(destination);
    // console.log('new list');
    // console.log('target', target);
    pickup.forEach(x => {
      cups.addAfter(target, x);
      debug && console.log('added to list', x.value, cups.toString());
      debug && console.log(x);
      target = x;
    });
  }
  // return all after 1
  return cupsMap.get(1);
}

// part 1
const cups = new LinkedList(cupsArray);
let current = play(cups, 100);

let resultPart1 = '';
for (let i = 0; i < 8; i++) {
  current = current.nextCircular;
  resultPart1 += current.value;
}
console.log('part 1', resultPart1);

// part 2
const highest = Math.max(...cupsArray) + 1;
const p2CupsArray = [...cupsArray, ...[...new Array(1000000 - cupsArray.length)].map((_, i) => highest + i)];
const p2Cups = new LinkedList(p2CupsArray);
current = play(p2Cups, 10000000);

const resultPart2 = current.nextCircular.value * current.nextCircular.nextCircular.value;
console.log('part 2', resultPart2);
