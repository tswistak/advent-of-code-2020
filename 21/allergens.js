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

  rd.on('line', line => {
    const [_, ingredients, allergens] = line.match(/([a-z ]*) \(contains ([a-z, ]*)\)/);
    data.push({
      ingredients: ingredients.split(' '),
      allergens: allergens.split(', ')
    });
  });

  await once(rd, 'close');
  
  const allergensToIngredientsMap = new Map();
  const allIngredients = new Set();

  // write all ingredients and allergens
  for (const { ingredients, allergens } of data) {
    for (const ing of ingredients) {
      allIngredients.add(ing);
    }
    for (const al of allergens) {
      allergensToIngredientsMap.set(al, null);
    }
  }

  // assign allergens to ingredients
  for (const { ingredients, allergens } of data) {
    for (const al of allergens) {
      const current = allergensToIngredientsMap.get(al);
      if (current === null) {
        // we never added allergens to this one, so add current ones
        allergensToIngredientsMap.set(al, ingredients);
      } else {
        // we always want to assign intersection of current and previous allergens
        const common = ingredients.filter(x => current.includes(x));
        allergensToIngredientsMap.set(al, common);
      }
    }
  }

  // filter out allergens to get one
  const allergens = new Map();
  while (allergens.size < allergensToIngredientsMap.size) {
    for (const [al, ing] of allergensToIngredientsMap.entries()) {
      if (ing.length === 1) {
        allergens.set(al, ing[0]);
        for (const [otherAl, otherIng] of allergensToIngredientsMap.entries()) {
          if (otherAl === al) continue;
          const filteredIngs = otherIng.filter(x => x !== ing[0]);
          allergensToIngredientsMap.set(otherAl, filteredIngs);
        }
      }
    }
  }

  const allergenIngredients = new Set([...allergens.values()]);

  // count all no-allergens
  let count = 0;
  for (const { ingredients } of data) {
    count += ingredients.filter(x => !allergenIngredients.has(x)).length;
  }

  console.log('count (part 1)', count);

  // part 2
  const sortedAllergens = [...allergens.keys()].sort();
  const list = sortedAllergens.map(x => allergens.get(x)).join(',');

  console.log('list (part 2)', list);
})();