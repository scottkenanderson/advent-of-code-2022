import { filePromise, sum } from 'aoc-utils';

filePromise()
  .then((data) => (
    data.map((line) => ([
      line.slice(0, line.length / 2),
      line.slice(line.length / 2, line.length)
    ])))
  ).then((rucksacks) => {
    return rucksacks.map(([compartment1, compartment2]) => {
      const overlap = compartment1.split('').filter((item) => compartment2.split('').includes(item));
      return overlap[0];
    })
  }).then((items) => {
    return items.map((c) => {
      const offset = c.toUpperCase() === c ? 64 - 26 : 96;
      return c.charCodeAt(0) - offset;
    }).reduce(sum);
  }).then((priority) => {
    console.log(`Part 1: ${priority}`);
  });

filePromise()
  .then((rucksacks) => {
    const buckets: Array<Array<string>> = [[]];
    rucksacks.forEach((rucksack) => {
      let lastBucket = buckets[buckets.length - 1];
      if (lastBucket.length >= 3) {
        buckets.push([])
        lastBucket = buckets[buckets.length - 1];
      }
      lastBucket.push(rucksack);
    })
    return buckets;
  }).then((buckets) => {
    return buckets.map(([compartment1, compartment2, compartment3]) => {
      const firstOverlap = compartment1.split('').filter((item) => compartment2.split('').includes(item));
      const overlap = firstOverlap.filter((item) => compartment3.split('').includes(item));
      return overlap[0];
    })
  }).then((items) => {
    return items.map((c) => {
      const offset = c.toUpperCase() === c ? 64 - 26 : 96;
      return c.charCodeAt(0) - offset;
    }).reduce(sum);
  }).then((priority) => {
    console.log(`Part 2: ${priority}`);
  });

