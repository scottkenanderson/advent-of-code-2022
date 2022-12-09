import { readFile, max, product, Coordinate } from 'aoc-utils';

interface Neighbours {
  top: Tree[];
  left: Tree[];
  right: Tree[];
  bottom: Tree[];
}
export interface Range {
  min: number;
  max: number;
}

export interface Grid {
  x: Range;
  y: Range;
}
class Tree {
  height: number;
  visible: boolean;
  scenicScore: number = 0;
  neighbours: Neighbours = {
    left: [],
    right: [],
    top: [],
    bottom: [],
  };

  constructor(height: string, visible: boolean = false) {
    this.height = parseInt(height, 10);
    this.visible = visible;
  }
}

const setToVisible = (trees: Tree[][], grid: Grid): void => {
  for (let y = grid.y.min; y < grid.y.max; y++) {
    for (let x = grid.x.min; x < grid.x.max; x++) {
      trees[y][x].visible = true;
    }
  }
}
const findTrees = (trees: Tree[][], treeCoordinate: Coordinate, grid: Grid): Tree[] => {
  const otherTrees: Tree[] = [];
  for (let y = grid.y.min; y < grid.y.max; y++) {
    for (let x = grid.x.min; x < grid.x.max; x++) {
      if (x === treeCoordinate.x && y === treeCoordinate.y) {
        continue;
      }
      otherTrees.push(trees[y][x]);
    }
  }
  return otherTrees;
}

const getNeighbours = (trees: Tree[][], treeCoordinate: Coordinate): Neighbours => {
  const left = findTrees(
    trees,
    treeCoordinate,
    { x: { min: 0, max: treeCoordinate.x }, y: { min: treeCoordinate.y, max: treeCoordinate.y + 1 } },
  ).reverse();;
  const right = findTrees(
    trees,
    treeCoordinate,
    { x: { min: treeCoordinate.x + 1, max: trees[0].length }, y: { min: treeCoordinate.y, max: treeCoordinate.y + 1 } },
  );
  const top = findTrees(
    trees,
    treeCoordinate,
    { x: { min: treeCoordinate.x, max: treeCoordinate.x + 1 }, y: { min: 0, max: treeCoordinate.y } },
  ).reverse();
  const bottom = findTrees(
    trees,
    treeCoordinate,
    { x: { min: treeCoordinate.x, max: treeCoordinate.x + 1 }, y: { min: treeCoordinate.y + 1, max: trees.length } },
  );
  return { top, left, bottom, right };
}

const setEdgesToVisible = (trees: Tree[][]): void => {
  setToVisible(trees, { x: { min: 0, max: trees[0].length }, y: { min: 0, max: 1 } });
  setToVisible(trees, { x: { min: 0, max: trees[0].length }, y: { min: trees.length - 1, max: trees.length } });
  setToVisible(trees, { x: { min: 0, max: 1 }, y: { min: 0, max: trees.length } });
  setToVisible(trees, { x: { min: trees[0].length - 1, max: trees[0].length }, y: { min: 0, max: trees.length } });

  const treesToCheck: Grid = {
    x: { min: 1, max: trees[0].length - 1 },
    y: { min: 1, max: trees.length - 1 },
  }

  for (let y = treesToCheck.y.min; y < treesToCheck.y.max; y++) {
    for (let x = treesToCheck.x.min; x < treesToCheck.x.max; x++) {
      const tree = trees[y][x]

      tree.neighbours = getNeighbours(trees, { x, y })

      tree.scenicScore = Object.values(tree.neighbours)
        .map((v: Tree[]) => {
          const index = v.findIndex(t => t.height >= tree.height);
          if (index === -1) {
            return v.length;
          }
          return index + 1;
        })
        .reduce(product)

      Object.values(tree.neighbours)
        .map((n) => n
          .map((t: Tree) => t.height)
          .reduce(max)
        )
        .forEach((n) => {
          if (n < tree.height) {
            tree.visible = true;
          }
        });
    }
  }
}

readFile()
  .then((data) => {
    return data.filter((d) => d !== '').map((d) => d.split('').map((c) => new Tree(c)));
  })
  .then((trees) => {
    setEdgesToVisible(trees);
    const visibleTrees = trees.flat().map((t) => t.visible).filter((v) => v === true).length;
    console.log('Part 1: ', visibleTrees);
    const maxScenicScore = trees.flat().map((t) => t.scenicScore).reduce(max);
    console.log('Part 2: ', maxScenicScore);
  })
