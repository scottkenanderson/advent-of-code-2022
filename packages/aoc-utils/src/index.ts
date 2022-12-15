import fs from 'fs';

export const readFile = async (): Promise<string[]> => new Promise<string[]>((resolve, reject) => {
  const filename = process.argv[2];
  fs.readFile(filename, 'utf8', (err: unknown, data: string) => {
    resolve(data.split('\n').filter(s => s !== ''));
  });
});

export function zip<T>(a: T[], b: T[]): T[][] {
  return Array.from(
    Array(Math.max(a.length, b.length)), (_, i) => (
      [a[i], b[i]]
    ),
  );
}

export const sum = (a: number, b: number): number => a + b;

export const max = (a: number, b: number): number => Math.max(a, b);

export const min = (a: number, b: number): number => Math.min(a, b);

export const product = (a: number, b: number): number => a * b;

export type Range = {
  min: number;
  max: number;
};

export class Grid<T> {
  data: T[][];
  visited: Point[] = [];

  constructor(initialData: T[][]) {
    this.data = initialData;
  }

  rows(): number {
    return this.data.length;
  }

  columns(): number {
    return this.data[0].length || 0;
  }

  retrieve(p: Point): T {
    this.visited.push(p);
    return this.data[p.y][p.x];
  }

  toString(): string {
    return this.data.map(g => g.join('\t')).join('\n');
  }
}

export class Coordinate {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  public equals(obj: Coordinate): boolean {
    return this.x === obj.x && this.y === obj.y;
  }
}

export class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }

  samePlane(other: Point): boolean {
    return this.x === other.x || this.y === other.y;
  }

  public equals(obj: Coordinate): boolean {
    return this.x === obj.x && this.y === obj.y;
  }
}
