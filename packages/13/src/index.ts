import {readFile, sum, product} from 'aoc-utils';
import {Pair, Packet} from './pair';

const makePairs = async (): Promise<Pair[]> => readFile().then(data => {
  const pairs: Pair[] = [];
  for (let i = 0; i < data.length; i += 2) {
    pairs.push(new Pair(data[i], data[i + 1]));
  }

  return pairs;
});

makePairs().then(pairs => {
  const indicesSum = pairs
    .map((pair, i) => pair.isInTheCorrectOrder() ? i + 1 : 0)
    .reduce(sum);

  console.log(`Part 1: ${indicesSum}`);
}, console.error);

readFile().then(data => {
  const packets: Packet[] = data.map((d: string) => new Packet(d));
  const dividerPackets = ['[[2]]', '[[6]]'];

  dividerPackets.forEach(p => {
    packets.push(new Packet(p));
  });

  packets.sort((a, b) => Pair.prototype.compare(a, b));

  const decoderKey = dividerPackets
    .map(dp => packets.findIndex(p => p.rawValue === dp))
    .map(i => i + 1)
    .reduce(product);

  console.log(`Part 2: ${decoderKey}`);
}, console.error);

