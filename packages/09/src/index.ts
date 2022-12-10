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
  tailVisited: Array<Coordinate> = [ new Coordinate(0, 0)];

  constructor (knotCount = 2) {
    this.knots = Array.from(Array(knotCount)).map(() => new Coordinate());
  }

  head() {
    return this.knots[0];
  }

  tail() {
    return this.knots[this.knots.length - 1];
  }

  printGrid() {
    const grid = generateGrid(30, 30);
    const offsetX = 12;
    const offsetY = 6;
    grid[offsetY][offsetX] = 's';
    Array.from(this.tailVisited).forEach(({ x, y }) => grid[y+offsetY][x+offsetX] = '#');
    this.knots.forEach((k, i) => grid[k.y+offsetY][k.x+offsetX] = i.toString());
    grid[this.tail().y+offsetY][this.tail().x+offsetX] = 'T';
    grid[this.head().y+offsetY][this.head().x+offsetX] = 'H';

    console.log(grid.reverse().map((x) => x.join(' ')).join('\n'));
    console.log();
  }

  moveKnot(instruction: Instruction, knot: Coordinate): void {
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
  }

  move(instruction: Instruction): void {
    for (let i = 0; i < instruction.distance; i++) {
      this.moveKnot(instruction, this.knots[0]);
      for (let k = 1; k < this.knots.length; k += 1) {
        const cur = this.knots[k-1];
        const next = this.knots[k];

        if (this.headAndTailAreTouching(cur, next)) {
          break;
        }

        const diffX = cur.x - next.x;
        if (diffX !== 0) {
          const direction = diffX >= 1 ? Direction.Right : Direction.Left;
          this.moveKnot(new Instruction(`${direction} 0`), next)
        }

        const diffY = cur.y - next.y;
        if (diffY !== 0) {
          const direction = diffY >= 1 ? Direction.Up : Direction.Down;
          this.moveKnot(new Instruction(`${direction} 0`), next)
        }

        if (k === this.knots.length - 1) {
          this.tailVisited.push(new Coordinate(this.tail().x, this.tail().y));
        }
      }
    }
    this.printGrid();
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

  readFilePromise.then((instructions) => {
    const rope = new Rope(2);
    instructions.forEach((i) => rope.move(i));
    return rope;
  })
  .then((rope) => {
    console.log('Part 1: ', new Set(Array.from(rope.tailVisited).map((c) => `${c.x},${c.y}`)).size);
  })

  readFilePromise.then((instructions) => {
    const rope = new Rope(10);
    instructions.forEach((i) => rope.move(i));
    return rope;
  })
  .then((rope) => {
    console.log('Part 2: ', new Set(rope.tailVisited.map((c) => `${c.x},${c.y}`)).size);
  })
