import { readFile, sum, product, min, Grid, Point, Range } from 'aoc-utils';

class Square {
  elevation: string;
  shortestPath: number = Number.MAX_SAFE_INTEGER;

  constructor(elevation: string) {
    this.elevation = elevation;
    if (elevation === 'S') {
      this.shortestPath = 0;
    }
  }

  isStart(): boolean {
    return this.elevation === 'S';
  }

  isFinish(): boolean {
    return this.elevation === 'E';
  }

  canStepTo(other: Square, downhill: boolean = false): boolean {
    if (!other || (!downhill && (this.isFinish() || other.isStart()))) {
      return false;
    }
    if (downhill) {
      return other.elevationValue() >= this.elevationValue() - 1;
    }
    return other.elevationValue() <= this.elevationValue() + 1;
  }

  elevationValue(): number {
    if (this.isStart()) {
      return 0;
    }
    if (this.isFinish()) {
      return 25;
    }
    return (this.elevation.charCodeAt(0) - 65) % 32;
  }

  toString(): string {
    // return `${this.elevation}: ${(this.elevation.charCodeAt(0) - 65) % 32}:${this.shortestPath}`;
    return `${this.elevation}:${this.shortestPath !== Number.MAX_SAFE_INTEGER ? this.shortestPath.toString().padStart(3, '0') : 'xxx'}`;
  }
}

const makeGrid = (): Promise<Grid<Square>> => {
  return readFile().then((data) => {
    const gridData = data.map((item) => {
      return item.split('').map((v) => new Square(v));
    })
    return new Grid<Square>(gridData);
  })
}

let paths: {[key: string]: Point[]} = {};

const findAllNeighbours = (startingPoint: Point, grid: Grid<Square>) => {
  const xRange: Range = {
    min: startingPoint.x-1 >= 0 ? startingPoint.x-1 : 0,
    max: startingPoint.x + 1 < grid.columns() ? startingPoint.x + 1 : startingPoint.x,
  };
  const yRange: Range = {
    min: startingPoint.y-1 >= 0 ? startingPoint.y-1 : 0,
    max: startingPoint.y + 1 < grid.rows() ? startingPoint.y + 1 : startingPoint.y,
  };

  return [...Array(yRange.max+1 - yRange.min).keys()]
  .map((y) => (y+yRange.min))
  .map((y) => {
    return [...Array(xRange.max+1 - xRange.min).keys()]
      .map((x) => (x+xRange.min))
      .map((x) => new Point(x, y))
  })
  .flat()
  .filter((p) => !p.equals(startingPoint))
  .filter((p) => p.samePlane(startingPoint))
}

const findHigherNeighbours = (startingPoint: Point, grid: Grid<Square>, downhill: boolean = false, visited: Point[] = [], i = 0): void => {
  if (visited.length > 350) { return; }
  const start = grid.retrieve(startingPoint);
  start.shortestPath = min(start.shortestPath, visited.length);
  if (start.isFinish()) {
    return;
  }
  visited.push(startingPoint);

  const allNeighbours = findAllNeighbours(startingPoint, grid)
    .filter((p) => start.canStepTo(grid.retrieve(p), downhill))

  if(allNeighbours.length === 0) {
    return;
  }

  allNeighbours.forEach((neighbour) => {
    const neighbourSquare = grid.retrieve(neighbour)
    if (neighbourSquare.shortestPath <= visited.length) {
      return;
    }
    findHigherNeighbours(neighbour, grid, downhill, [...visited], i + 1)
  });
}

const findLowerNeighbours = (startingPoint: Point, grid: Grid<Square>, downhill: boolean = false, visited: Point[] = [], i = 0): void => {
  if (visited.length > 350) { return; }

  const start = grid.retrieve(startingPoint);
  start.shortestPath = min(start.shortestPath, visited.length);
  if (start.elevation === 'a') {
    return;
  }
  visited.push(startingPoint);

  const allNeighbours = findAllNeighbours(startingPoint, grid)
    .filter((p) => start.canStepTo(grid.retrieve(p), downhill))

  if (allNeighbours.length === 0) {
    return;
  }

  allNeighbours.forEach((neighbour) => {
    const neighbourSquare = grid.retrieve(neighbour)
    if (neighbourSquare.shortestPath <= visited.length) {
      return;
    }
    findLowerNeighbours(neighbour, grid, downhill, [...visited], i + 1)
  });
}

const findStartingPoints = (grid: Grid<Square>, startingElevations: string[] = ['S']): Point[] => {
  const startingPoints = [];

  for (let y = 0; y < grid.rows(); y++) {
    for (let x = 0; x < grid.columns(); x++) {
      const p = new Point(x, y);
      if (startingElevations.includes(grid.retrieve(p).elevation)) {
        startingPoints.push(p);
      }
    }
  }

  return startingPoints;
}

const findEnds = (grid: Grid<Square>, endElevation: string): Square[] => {
  return grid.data
    .flat()
    .filter(x => x.elevation === endElevation)
}

makeGrid().then((grid) => {
  const startingPoint = findStartingPoints(grid)[0];
  findHigherNeighbours(startingPoint, grid);
  const end = findEnds(grid, 'E')[0];
  console.log(`Part 1: ${end.shortestPath}`);
});

makeGrid().then((grid) => {
  const startingPoint = findStartingPoints(grid, ['E'])[0];
  findLowerNeighbours(startingPoint, grid, true);
  const end = findEnds(grid, 'a')
    .map((x) => x.shortestPath)
    .reduce(min);

  console.log(`Part 2: ${end}`);
});
