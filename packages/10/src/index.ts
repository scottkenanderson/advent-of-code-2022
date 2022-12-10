import { readFile, sum } from 'aoc-utils';

enum InstructionType {
  ADD_X = 'addx',
  NO_OP = 'noop',
}

enum RegisterType {
  X = 'X',
}

interface InstructionDefinition {
  register: RegisterType | null;
  cycles: number;
}

const instructionDefinitions: {[key: string]: InstructionDefinition} = {
  [InstructionType.ADD_X]: {
    register: RegisterType.X,
    cycles: 2,
  },
  [InstructionType.NO_OP]: {
    register: null,
    cycles: 1,
  }
}

class Command {
  type: InstructionType;
  value: number | null;

  constructor(type: InstructionType, value: number | null = null) {
    this.type = type;
    this.value = value;
  }
}

class Register {
  currentInstruction: Command | null = null;
  value: number;

  constructor(initialValue = 0) {
    this.value = initialValue;
  }
}

interface Cycle {
  cycleValue: number;
  registerValues: {[key: string]: number};
  signalStrength: number;
}

class Cpu {
  registers: {[key: string]: Register} = {
    [RegisterType.X]: new Register(1),
  };
  currentCycle;
  cycles: Cycle[];

  constructor(initialCycle: number = 1) {
    this.currentCycle = initialCycle;
    this.cycles = [
      {
        cycleValue: this.currentCycle,
        registerValues: this.getRegisterValues(),
        signalStrength: this.calculateSignalStrength(),
      },
    ]
  }

  execute(instruction: Command): void {
    const def = instructionDefinitions[instruction.type]
    for (let i = 0; i < def.cycles; i++) {
      if (i === def.cycles - 1 && def.register && instruction.value) {
        this.registers[def.register].value += instruction.value;
      }
      this.incrementCycle();
    }
  }

  incrementCycle(): void {
    this.currentCycle += 1;
    this.cycles.push(
      {
        cycleValue: this.currentCycle,
        registerValues: this.getRegisterValues(),
        signalStrength: this.calculateSignalStrength(),
      }
    )
  }

  calculateSignalStrength(): number {
    return this.registers[RegisterType.X].value * this.currentCycle;
  }

  private getRegisterValues(): {[key: string]: number} {
    return Object.entries(this.registers)
      .map(([ registerName, register ]) => ({ [registerName]: register.value}))
      .reduce((prev, cur) => {
        return {...prev, ...cur}
      }, {});
  }
}

const executeCpu = readFile()
  .then((data) => {
    return data
      .map((i) => {
        const split = i.split(' ');
        return new Command(split[0] as InstructionType, parseInt(split[1], 10) || null);
      });
    }
  )
  .then((instructions) => {
    const cpu = new Cpu();
    instructions.forEach((i) => {
      cpu.execute(i);
    })
    return cpu
  })
executeCpu
  .then((cpu) => {
    const cycles = [20, 60, 100, 140, 180, 220];
    return cycles.map((i) => cpu.cycles[i-1].signalStrength).reduce(sum);
  })
  .then((signalStrength) => {
    console.log('Part 1: ', signalStrength);
  });

executeCpu
  .then((cpu) => (
    cpu.cycles.slice(1).map((c, i) => {
      const pixel = ((i) % 40) + 1;
      const spritePosition = c.registerValues[RegisterType.X];
      const pixelValue = pixel >= spritePosition -1 && pixel <= spritePosition + 1 ?
        '#' :
        '.';
      return pixelValue + (pixel === 40 ? '\n' : '');
    }).join('')
  ))
  .then((string) => {
    console.log(`Part 2:\n\n${string}`);
  })
