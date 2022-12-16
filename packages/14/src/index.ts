import {readFile, max, Point, Grid} from 'aoc-utils';
import {type RockStructure, Tile} from './rock';

const sandPourPoint = new Point(500, 0);
const xOffset = sandPourPoint.x;

const findUnitsOfSand = (grid: Grid<Tile>, maxY: number): number => {
  let i = 0;
  while (i < 250000) {
    let y = -1;
    let {x} = sandPourPoint;

    while (y <= maxY) {
      y += 1;

      if (y === maxY - 1) {
        return i;
      }

      const current = grid.retrieve(new Point(x, y));
      const next = grid.retrieve(new Point(x, y + 1));
      if (next.symbol === '.') {
        continue;
      }

      // console.log('SAND', y, i);
      // const old = current.symbol;
      // current.symbol = 'X';

      // console.log(grid.toString());
      // current.symbol = old;

      const leftPoint = new Point(x - 1, y + 1);
      const left = grid.retrieve(leftPoint);
      if (left.symbol === '.') {
        x -= 1;
        continue;
      }

      const rightPoint = new Point(x + 1, y + 1);
      const right = grid.retrieve(rightPoint);
      if (right.symbol === '.') {
        x += 1;
        continue;
      }

      if (Point.equals(new Point(x, y), sandPourPoint)) {
        return i + 1;
      }

      current.mark('o');
      break;
    }

    i += 1;
  }

  return -1;
};

const makeRockStructures = async (): Promise<RockStructure[]> => readFile()
  .then(data => data
    .map(path => path.split(' -> ').map(p => {
      const [x, y] = p.split(',').map(c => parseInt(c, 10));
      return new Point(x - 500, y);
    })));

makeRockStructures().then(rockStructures => {
  const maxY = rockStructures.map(r => r.map(rs => rs.y).reduce(max)).reduce(max) + 1;
  const initialData: Tile[][] = Array.from(Array(maxY).keys())
    .map(_ => Array.from(Array(xOffset * 2).keys())
      .map(_ => new Tile()),
    );
  const grid: Grid<Tile> = new Grid<Tile>(initialData, '');
  grid.retrieve(sandPourPoint).mark('+');
  rockStructures.forEach(rockStructure => {
    for (let i = 0; i < rockStructure.length - 1; i++) {
      Point.pointsBetween(rockStructure[i], rockStructure[(i + 1)]).forEach(point => {
        grid.retrieve(new Point(point.x + xOffset, point.y)).mark('#');
      });
    }
  });

  const unitsOfSand = findUnitsOfSand(grid, maxY);
  console.log(`Part 1: ${unitsOfSand}`);
}, console.error);

makeRockStructures().then(rockStructures => {
  const maxY = rockStructures.map(r => r.map(rs => rs.y).reduce(max)).reduce(max) + 3;
  const initialData: Tile[][] = Array.from(Array(maxY).keys())
    .map(_ => Array.from(Array(xOffset * 2).keys())
      .map(_ => new Tile()),
    );
  const grid: Grid<Tile> = new Grid<Tile>(initialData, '');
  grid.retrieve(sandPourPoint).mark('+');
  rockStructures.forEach(rockStructure => {
    for (let i = 0; i < rockStructure.length - 1; i++) {
      Point.pointsBetween(rockStructure[i], rockStructure[(i + 1)]).forEach(point => {
        grid.retrieve(new Point(point.x + xOffset, point.y)).mark('#');
      });
    }
  });
  Point.pointsBetween(new Point(0, maxY - 1), new Point(grid.columns() - 1, maxY - 1)).forEach(point => {
    grid.retrieve(point).mark('#');
  });

  const unitsOfSand = findUnitsOfSand(grid, maxY);
  console.log(`Part 1: ${unitsOfSand}`);
}, console.error);
