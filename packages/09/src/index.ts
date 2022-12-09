import { readFile, max, product, Coordinate, Grid } from 'aoc-utils';

enum Direction {
  Left = 'L',
  Right = 'R',
  Up = 'U',
  Down = 'D',
}

class Instruction {
  direction: Direction;
  distance: number;

  constructor(rawInstruction: string) {
    const [ directionString, distanceString ] = rawInstruction.split(' ');
    this.direction = directionString as Direction;
    this.distance = parseInt(distanceString);
  }
}

const generateGrid = (x: number, y: number): string[][] => {
  return Array.from(Array(x)).map(() => Array.from(Array(y)).map(() => '.'));
};

class Rope {
  knots: Coordinate[];
  tailVisited: Set<Coordinate> = new Set<Coordinate>([ new Coordinate(0, 0)]);

  constructor (knotCount = 2) {
    this.knots = Array.from(Array(knotCount)).map(() => new Coordinate());
    console.log(this.knots);
  }

  head() {
    // console.log(this.knots)
    return this.knots[0];
  }

  tail() {
    return this.knots[this.knots.length - 1];
  }

  printGrid() {
    const grid = generateGrid(5, 6);
    // Array.from(this.tailVisited).forEach(({ x, y }) => grid[y][x] = '#');
    grid[0][0] = 's';
    this.knots.forEach((k, i) => grid[k.y][k.x] = i.toString());
    grid[this.tail().y][this.tail().x] = 'T';
    grid[this.head().y][this.head().x] = 'H';

    console.log(grid.reverse().map((x) => x.join(' ')).join('\n'));
    console.log();
  }

  move(instruction: Instruction): void {
    // console.log(instruction)
    for (let i = 0; i < instruction.distance; i++) {
      let knot = this.knots[0];
      let previous = new Coordinate(knot.x, knot.y);
      switch(instruction.direction) {
        case Direction.Right:
          knot.x += 1;
          break;
        case Direction.Left:
          knot.x -= 1;
          break;
        case Direction.Up:
          knot.y += 1;
          break;
        case Direction.Down:
          knot.y -= 1;
          break;
      }
      for (let k = 0; k < this.knots.length - 1; k++) {
        const next = this.knots[k+1];
        console.log(knot, previous, next);
        this.updateTail(previous, knot, next, k);
        previous = new Coordinate(knot.x, knot.y);
        knot = this.knots[k];
      }
      this.printGrid();
    }
  }

  updateTail(previousHead: Coordinate, knot: Coordinate, next: Coordinate, index: number): boolean {
    if (this.headAndTailAreTouching(knot, next)) {
      return false;
    }
    this.knots[index + 1] = previousHead;
    if (index === this.knots.length - 2) {
      this.tailVisited.add(previousHead);
      return true;
    }
    return false;
  }

  private headAndTailAreTouching(head: Coordinate, tail: Coordinate): boolean {
    return tail.x >= head.x - 1
      && tail.x <= head.x + 1
      && tail.y >= head.y - 1
      && tail.y <= head.y + 1;
  }
}

const readFilePromise = readFile()
  .then((data) => {
    return data.map((i) => new Instruction(i));
  })

  // readFilePromise.then((instructions) => {
  //   const rope = new Rope();
  //   instructions.forEach((i) => rope.move(i));
  //   return rope;
  // })
  // .then((rope) => {
  //   console.log('Part 1: ', new Set(Array.from(rope.tailVisited).map((c) => `${c.x},${c.y}`)).size);
  // })

  readFilePromise.then((instructions) => {
    const rope = new Rope(3);
    instructions.forEach((i) => rope.move(i));
    return rope;
  })
  .then((rope) => {
    console.log('Part 2: ', new Set(Array.from(rope.tailVisited).map((c) => `${c.x},${c.y}`)).size);
    const maxX = Array.from(rope.tailVisited).map(x => x.x).reduce(max);
    const maxy = Array.from(rope.tailVisited).map(x => x.y).reduce(max);
  })
