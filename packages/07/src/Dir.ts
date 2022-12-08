import { sum } from 'aoc-utils';
import { Sizable } from "./Sizable";
import { File } from "./File";

export class Dir implements Sizable {
  name: string;
  children: {[key: string]: File | Dir};
  parent: Dir | null;

  constructor(name: string, parent: Dir | null, children: {[key: string]: File | Dir} = {}) {
    this.name = name;
    this.children = children;
    this.parent = parent;
  }

  totalSize(): number {
    return Object.values(this.children).map((child: Sizable) => child.totalSize()).reduce(sum);
  }

  toString(): string {
    return `- ${this.name} (dir, size=${this.totalSize()})\n${Object.values(this.children).map(child => child.toString()).join('\n')}`;
  }
}
