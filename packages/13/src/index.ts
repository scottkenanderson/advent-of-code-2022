import { readFile, sum, product, min, Grid, Point, Range } from 'aoc-utils';

class Pair {
  left: string = '';
  right: string = '';
}

const makeGrid = (): Promise<Pair[]> => {
  return readFile().then((data) => {
    const pairs: Pair[] = [];
    pairs.push(new Pair());
    data.forEach((item) => {
      const lastPair = pairs[pairs.length-1];
      if (!!lastPair.right) {
        pairs.push(new Pair());
        return;
      }
      if (lastPair.left === '') {
        lastPair.left = item;
        return;
      }
      if (lastPair.right === '') {
        lastPair.right = item;
        return;
      }
    })
    return pairs; pairs.filter(pair => !!pair.left && !!pair.right);
  })
}


makeGrid().then((pairs) => {
  console.log(pairs);
  // console.log(`Part 1: ${end.shortestPath}`);
});
