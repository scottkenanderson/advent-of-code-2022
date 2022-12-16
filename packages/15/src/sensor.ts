import {Point} from 'aoc-utils';

export type Pair = {
  closestBeaconPoint: Point;
  sensorPoint: Point;
};

export type Line = {
  start: Point;
  end: Point;
};

export class Sensor extends Point {
  sensorPoint: Point;
  closestBeaconPoint: Point;
  manhattanDistance: number;

  constructor({sensorPoint, closestBeaconPoint}: Pair) {
    super();
    this.sensorPoint = sensorPoint;
    this.closestBeaconPoint = closestBeaconPoint;
    this.manhattanDistance = Point.manhattanDistance(this.sensorPoint, this.closestBeaconPoint);
  }

  perimeter(): Line[] {
    const top = new Point(this.sensorPoint.x, this.sensorPoint.y + this.manhattanDistance);
    const right = new Point(this.sensorPoint.x + this.manhattanDistance, this.sensorPoint.y);
    const bottom = new Point(this.sensorPoint.x, this.sensorPoint.y - this.manhattanDistance);
    const left = new Point(this.sensorPoint.x - this.manhattanDistance, this.sensorPoint.y);
    return [
      {start: top, end: right},
      {start: right, end: bottom},
      {start: bottom, end: left},
      {start: left, end: top},
    ];
  }

  isInRange(p: Point): boolean {
    return Point.manhattanDistance(this.sensorPoint, p) <= this.manhattanDistance;
  }
}

