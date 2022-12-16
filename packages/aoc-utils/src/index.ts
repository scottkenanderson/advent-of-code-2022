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
  separator: string;

  constructor(initialData: T[][], separator = '\t') {
    this.data = initialData;
    this.separator = separator;
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

  set(p: Point, value: T) {
    this.data[p.y][p.x] = value;
  }

  toString(): string {
    return this.data.map(g => g.join(this.separator)).join('\n');
  }
}

export class Point {
  public static pointsBetween(p1: Point, p2: Point): Point[] {
    const xRange = {min: Math.min(p1.x, p2.x), max: Math.max(p1.x, p2.x)};
    const yRange = {min: Math.min(p1.y, p2.y), max: Math.max(p1.y, p2.y)};
    const points = [];
    for (let y = yRange.min; y <= yRange.max; y += 1) {
      for (let x = xRange.min; x <= xRange.max; x += 1) {
        points.push(new Point(x, y));
      }
    }

    return points;
  }

  public static manhattanDistance(p1: Point, p2: Point): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  }

  public static equals(p1: Point, p2: Point): boolean {
    return p1.x === p2.x && p1.y === p2.y;
  }

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

  offset(xOffset: number, yOffset: number): Point {
    return new Point(this.x + xOffset, this.y + yOffset);
  }

  neighbours(manhattanDistance: number): Point[] {
    const top = new Point(this.x, this.y + manhattanDistance);
    const right = new Point(this.x + manhattanDistance, this.y);
    const bottom = new Point(this.x, this.y - manhattanDistance);
    const left = new Point(this.x - manhattanDistance, this.y);

    return [top, right, bottom, left];
  }

  public equals(obj: Point): boolean {
    return this.x === obj.x && this.y === obj.y;
  }
}

export class Coordinate extends Point {
}
