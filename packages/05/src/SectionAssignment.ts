export class SectionAssignment {
  min: number;
  max: number;

  constructor(min: number | string, max: number | string) {
    this.min = parseInt(min as string);
    this.max = parseInt(max as string);
  }

  fullyContains(other: SectionAssignment): boolean {
    return other.min >= this.min && other.max <= this.max;
  }

  overlaps(other: SectionAssignment): boolean {
    return (other.min <= this.max && other.max >= this.max) ||
      (other.min <= this.min && other.max >= this.min);
  }
}
