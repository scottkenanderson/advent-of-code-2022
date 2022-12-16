import {Point} from 'aoc-utils';
import {Sensor} from './sensor';

describe('day15', () => {
  describe('sensor', () => {
    it('runs the tests', () => {
      expect(true).toBe(true);
    });

    it('creates a perimeter sensor', () => {
      const sensor = new Sensor({
        sensorPoint: new Point(0, 0),
        closestBeaconPoint: new Point(1, 0),
      });
      const expected = [
        {start: new Point(0, 1), end: new Point(1, 0)},
        {start: new Point(1, 0), end: new Point(0, -1)},
        {start: new Point(0, -1), end: new Point(-1, 0)},
        {start: new Point(-1, 0), end: new Point(0, 1)},
      ];

      const perimeters = sensor.perimeter();

      expected.forEach(e => {
        expect(perimeters).toContainEqual(e);
      });
    });

    it('creates a perimeter sensor', () => {
      const sensor = new Sensor({
        sensorPoint: new Point(1, 1),
        closestBeaconPoint: new Point(2, 0),
      });
      const expected = [
        {start: new Point(1, 3), end: new Point(3, 1)},
        {start: new Point(3, 1), end: new Point(1, -1)},
        {start: new Point(1, -1), end: new Point(-1, 1)},
        {start: new Point(-1, 1), end: new Point(1, 3)},
      ];

      const perimeters = sensor.perimeter();

      expected.forEach(e => {
        expect(perimeters).toContainEqual(e);
      });
    });

    // It('should create a new Pair', () => {
    //   const p = new Pair('[]', '[]');

    //   expect(p.toString()).toEqual('[] []');
    // });

  // it.each([
  //   [['[2]', '[2]'], true],
  // ])('subtracts %p expecting %p', (packets: string[], result: boolean) => {
  //   const pair = new Pair(...packets);
  //   expect(pair.isInTheCorrectOrder()).toBe(result);
  // });
  });
});
