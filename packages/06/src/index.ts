import { readFile } from 'aoc-utils';

const findMarker = (buffer: string[], markerLength: number): number => {
  const signal: string[] = [];

  let counter = 1;

  for (const c of buffer) {
    if (signal.length >= markerLength) {
      signal.shift();
    }
    signal.push(c);
    if (new Set(signal).size === markerLength){
      return counter;
    }
    counter += 1;
  }
  return -1;
}

const readFilePromise = readFile()
  .then((data) => {
    return data[0].split('');
  })

readFilePromise
  .then((buffer) => console.log('Part 1: ', findMarker(buffer, 4)));

readFilePromise
.then((buffer) => console.log('Part 1: ', findMarker(buffer, 14)));
