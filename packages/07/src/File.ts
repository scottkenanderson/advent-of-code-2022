import { Sizable } from "./Sizable";

export class File implements Sizable {
  name: string;
  size: number;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }

  totalSize(): number {
    return this.size;
  }

  toString(): string {
    return `- ${this.name} (file, size=${this.size})`;
  }
}
