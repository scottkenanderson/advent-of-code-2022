import { readFile } from 'aoc-utils';
import { SectionAssignment } from './SectionAssignment';

const readFile = readFile()
  .then((data) => (
    data
      .map((line) => line.split(','))
      .map(([first, second]) => {
        const [ firstMin, firstMax ] = first.split('-');
        const [ secondMin, secondMax ] = second.split('-');
        return [
          new SectionAssignment(firstMin, firstMax),
          new SectionAssignment(secondMin, secondMax),
        ]
      })
    )
  );

readFile
  .then((assignments) =>
    assignments
      .map(([first, second]) => first.fullyContains(second) || second.fullyContains(first))
      .filter((fullyContains) => fullyContains === true)
      .length
  ).then((count) => console.log(`Part 1: ${count}`))

readFile
  .then((assignments) =>
    assignments
      .map(([first, second]) => first.overlaps(second) || second.overlaps(first))
      .filter((overlaps) => overlaps === true)
      .length
  ).then((count) => console.log(`Part 2: ${count}`))