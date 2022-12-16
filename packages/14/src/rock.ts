import {type Point} from 'aoc-utils';

export type RockStructure = Point[];

export class Tile {
  symbol = '.';

  mark(symbol: string) {
    this.symbol = symbol;
  }

  toString() {
    return this.symbol;
  }
}
