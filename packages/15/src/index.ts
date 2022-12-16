import {readFile, max, min, Point, Grid, type Range, Coordinate} from 'aoc-utils';
import {type Line, Sensor, type Pair} from './sensor';

const yPart1 = parseInt(process.argv[3], 10);

type Parsed = {
  sensors: Sensor[];
  rangeX: Range;
};

type ParsedPoint = {
  x: number;
  y: number;
};

const makeRockStructures = async (): Promise<Parsed> => readFile()
  .then(data => {
    const sensors: Sensor[] = [];

    data.forEach(line => {
      // console.log(line);
      const match = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/.exec(line) ?? [];
      sensors.push(new Sensor({
        sensorPoint: new Point(parseInt(match[1], 10), parseInt(match[2], 10)),
        closestBeaconPoint: new Point(parseInt(match[3], 10), parseInt(match[4], 10)),
      }));
    });

    const maxSensorDistance = sensors.map(sensor => sensor.manhattanDistance).reduce(max);
    const minX = sensors.map(({sensorPoint}) => sensorPoint.x).reduce(min) - maxSensorDistance;
    const maxX = sensors.map(({sensorPoint}) => sensorPoint.x).reduce(max) + maxSensorDistance;
    return {
      sensors,
      rangeX: {min: minX < 0 ? minX : 0, max: maxX},
    };
  });

makeRockStructures().then(({sensors, rangeX}) => {
  let x = rangeX.min;
  const maxX = rangeX.max;
  const y = yPart1;

  let positions = 0;
  const incrementPosition = () => {
    positions += 1;
  };

  const knownBeacons = new Set(sensors
    .map(s => JSON.stringify(s.closestBeaconPoint)),
  );

  for (x; x <= maxX; x += 1) {
    const p = new Point(x, y);
    const sensorsInRange = sensors.filter(sensor => sensor.isInRange(p));

    if (sensorsInRange.length > 0 && !knownBeacons.has(JSON.stringify(p))) {
      incrementPosition();
    }
  }

  console.log(`Part 1: ${positions}`);
}, console.error);

const findIntersectionPoint = (l1: Line, l2: Line): Point | undefined => {
  const denominator = (
    (
      (l2.end.y - l2.start.y) * (l1.end.x - l1.start.x)
    ) - (
      (l2.end.x - l2.start.x) * (l1.end.y - l1.start.y)
    )
  );

  if (denominator === 0) {
    return undefined;
  }

  const ua = (
    (
      (l2.end.x - l2.start.x) * (l1.start.y - l2.start.y)
    ) - (
      (l2.end.y - l2.start.y) * (l1.start.x - l2.start.x)
    )
  ) / denominator;
  const ub = (
    (
      (l1.end.x - l1.start.x) * (l1.start.y - l2.start.y)
    ) - (
      (l1.end.y - l1.start.y) * (l1.start.x - l2.start.x)
    )
  ) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return undefined;
  }

  // Return a object with the x and y coordinates of the intersection
  const x = l1.start.x + (ua * (l1.end.x - l1.start.x));
  const y = l1.start.y + (ua * (l1.end.y - l1.start.y));

  return new Point(Math.ceil(x), Math.ceil(y));
};

const findPoint = (sensors: Sensor[]): Point => {
  const maxValue = yPart1 * 2;
  const perimeters = sensors.map((s, i) => s.perimeter()).flat();
  // console.log(JSON.stringify(perimeters, null, 2));
  const intersections = new Set<string>();

  perimeters.forEach((l1: Line) => {
    const otherPerimeters = perimeters.filter((l2: Line) => !(l1.start === l2.start && l1.end === l2.end));
    otherPerimeters.forEach((l2: Line) => {
      const intersection = findIntersectionPoint(l1, l2);
      if (intersection) {
        intersections.add(JSON.stringify(intersection));
      }
    });
  });
  const allIntersections = Array.from(intersections).map(i => {
    const p = JSON.parse(i) as ParsedPoint;
    return new Point(p.x, p.y);
  })
    .map(s => s.neighbours(1))
    .flat()
    .filter(p => p.x >= 0 && p.x <= maxValue && p.y >= 0 && p.y <= maxValue);
  const intersectionsSet = Array.from(new Set(allIntersections.map(i => JSON.stringify(i))))
    .map(i => {
      const p = JSON.parse(i) as ParsedPoint;
      return new Point(p.x, p.y);
    })
    .map(p => {
      const sensorsInRange = sensors.filter(sensor => sensor.isInRange(p));

      if (sensorsInRange.length === 0) {
        return p;
      }

      return undefined;
    });
  return intersectionsSet.filter(p => Boolean(p))[0]!;
};

makeRockStructures().then(({sensors}) => {
  const position = findPoint(sensors);
  const tuningFrequency = (position.x * 4000000) + position.y;
  console.log(`Part 2: ${tuningFrequency}`);
}, console.error);

