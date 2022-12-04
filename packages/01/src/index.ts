import { filePromise } from 'aoc-utils';

filePromise()
  .then((data) => {
    const elves: Array<Array<number>> = [[]]
    data.forEach((ration) => {
      if (ration === '') {
        elves.push([]);
        return;
      }
      const index = elves.length - 1;
      elves[index].push(parseInt(ration))
    })
    return elves;
  })
  .then((elves) => {
    const caloriesPerElf = elves.map((value) => value.reduce((prev, cur) => prev + cur));
    const maxCalories = caloriesPerElf.reduce((prev, cur) => Math.max(prev, cur));
    caloriesPerElf.sort((a, b) => b - a);
    const top3Calories = caloriesPerElf.slice(0, 3).reduce((prev, cur) => prev + cur)
    console.log(`Part 1: ${maxCalories}`);
    console.log(`Part 2: ${top3Calories}`);
  });
