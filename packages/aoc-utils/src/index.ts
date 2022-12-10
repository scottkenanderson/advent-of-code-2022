import fs from 'fs';

export const readFile = (): Promise<Array<string>> => {
  return new Promise<Array<string>>((resolve, reject) => {
    const filename = process.argv[2];
    fs.readFile(filename, 'utf8', (err: unknown, data: string) => {
      resolve(data.split("\n").filter(s => s !== ''));
    })
  })
};

export const sum = (a: number, b: number): number => a + b;

export const max = (a: number, b: number): number => Math.max(a, b);

export const product = (a: number, b: number): number => a * b;

export interface Range {
  min: number;
  max: number;
}

export class Grid<T> {
  data: T[][];

  constructor(data: T[][]) {
    this.data = data;
  }
}

export class Coordinate {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public equals(obj: Coordinate) : boolean {
    return this.x === obj.x && this.y === obj.y;
}
}
