import { readFile } from 'aoc-utils';

class Instruction {
  move: number;
  from: number;
  to: number;

  REGEX = /move (?<move>\d+) from (?<from>\d+) to (?<to>\d)/;

  constructor(instructionString: string) {
    const groups = instructionString.match(this.REGEX)?.groups;
    this.move = parseInt(groups?.move || "-1");
    this.from = parseInt(groups?.from || "-1");
    this.to = parseInt(groups?.to || "-1");
  }
}

const CRATE_REGEX = /^((?:\[\w\])| {3})(?: ((?:\[\w\])| {3}))+$/;

readFile()
  .then((data) => {
    const parsed = {
      instructions: new Array<Instruction>(),
      crates: new Array<Array<string>>(),
    }
    data.forEach((value) => {
      let crateIndex = 0;
      if(CRATE_REGEX.exec(value)) {
        const split = value.split('');
        for (let i = 0; i < split.length; i += 4) {
          const crateValue = split[i+1];
          if (parsed.crates.length < crateIndex + 1) {
            parsed.crates.push([])
          }

          crateIndex += 1;
          if (crateValue === ' ') {
            continue;
          }

          parsed.crates[crateIndex-1].push(crateValue);
        }
      }
      if(new Instruction("").REGEX.exec(value)) {
        parsed.instructions.push(new Instruction(value));
      }
    });
    // console.log(parsed)
    return parsed;
  })
  .then(({ instructions, crates }) => {
    instructions.forEach((instruction) => {
      const queue = [];
      for (let i = 0; i < instruction.move; i += 1) {
        queue.push(crates[instruction.from-1].shift())
      }
      // console.log(instruction, queue)
      queue.forEach((crate) => {
        crates[instruction.to-1].unshift(crate as string);
      })
    })
    return crates;
  })
  .then((crates) => {
    return ['part 1:', crates.map((crate) => {
      return crate[0]
    }).join('')].join(' ')
  })
  .then(console.log)

readFile()
  .then((data) => {
    const parsed = {
      instructions: new Array<Instruction>(),
      crates: new Array<Array<string>>(),
    }
    data.forEach((value) => {
      let crateIndex = 0;
      if(CRATE_REGEX.exec(value)) {
        const split = value.split('');
        for (let i = 0; i < split.length; i += 4) {
          const crateValue = split[i+1];
          if (parsed.crates.length < crateIndex + 1) {
            parsed.crates.push([])
          }

          crateIndex += 1;
          if (crateValue === ' ') {
            continue;
          }

          parsed.crates[crateIndex-1].push(crateValue);
        }
      }
      if(new Instruction("").REGEX.exec(value)) {
        parsed.instructions.push(new Instruction(value));
      }
    });
    // console.log(parsed)
    return parsed;
  })
  .then(({ instructions, crates }) => {
    instructions.forEach((instruction) => {
      const queue = [];
      for (let i = 0; i < instruction.move; i += 1) {
        queue.unshift(crates[instruction.from-1].shift())
      }
      // console.log(instruction, queue)
      queue.forEach((crate) => {
        crates[instruction.to-1].unshift(crate as string);
      })
    })
    return crates;
  })
  .then((crates) => {
    return ['part 2:', crates.map((crate) => {
      return crate[0]
    }).join('')].join(' ')
  })
  .then(console.log)
