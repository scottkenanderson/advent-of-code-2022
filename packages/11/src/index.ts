import { readFile, sum, product } from 'aoc-utils';

interface RawMonkeys {
  id: number;
  startingItems?: number[];
  operation?: string;
  test?: string;
  ifTrue?: number;
  ifFalse?: number;
}

class Monkey {
  items: number[];
  operation: (item: number) => number;
  divisor: number;
  ifTrue: number;
  ifFalse: number;
  inspectionCount: number = 0;

  constructor(
    items: number[],
    operation: (item: number) => number,
    divisor: number,
    ifTrue: number,
    ifFalse: number
  ) {
    this.items = items;
    this.operation = operation;
    this.divisor = divisor;
    this.ifTrue = ifTrue;
    this.ifFalse = ifFalse;
  }

  inspect(): number {
    this.inspectionCount += 1;
    return this.items.shift() || -1;
  }
}

const makeMonkeys = (): Promise<Monkey[]> => {
  return readFile()
    .then((data) => {
      const rawMonkeys: RawMonkeys[] = []
      data
        .forEach((i) => {
          if (/Monkey/.test(i)) {
            rawMonkeys.push({ id: parseInt(i.split(' ')[1]) });
            return;
          }
          const monkey = rawMonkeys[rawMonkeys.length - 1];
          if (/  Starting items/.test(i)) {
            const match = /  Starting items: (\d+(?:, \d+)*)/.exec(i) || [];
            monkey.startingItems = match[1].split(', ').map((m) => parseInt(m, 10));
          }
          if(/Operation/.test(i)) {
            monkey.operation = i.split('  Operation: ')[1];
          }
          if(/Test/.test(i)) {
            monkey.test = i.split('  Test: ')[1];
          }
          if(/If true/.test(i)) {
            const match = (/monkey (\d+)/.exec(i) || [])[1];
            monkey.ifTrue = parseInt(match);
          }
          if(/If false/.test(i)) {
            const match = (/monkey (\d+)/.exec(i) || [])[1];
            monkey.ifFalse = parseInt(match);
          }
        });
        return rawMonkeys;
      }
    )
    .then((rawMonkeys) => {
      return rawMonkeys.map(m => {
        const { startingItems, ifTrue, ifFalse, operation, test } = m;
        const testDivisor = parseInt((/divisible by (\d+)/.exec(test as string) || [])[1], 10);
        const operationMatch = /new = old ([+\*]) (old|\d+)/.exec(operation as string) || [];
        const operationFunction = (item: number) => {
          let func = product;
          if (operationMatch[1] === '+') {
            func = sum;
          }

          const secondNumber = operationMatch[2] === 'old' ? item : parseInt(operationMatch[2], 10);

          return func(item, secondNumber);
        }
        return new Monkey(startingItems as number[], operationFunction, testDivisor, ifTrue as number, ifFalse as number);
      });
    });
}

makeMonkeys()
  .then((monkeys) => {
    for (let i = 0; i < 20; i++) {
      monkeys.forEach((monkey) => {
        // console.log(monkey)
        while (monkey.items.length > 0) {
          const item = monkey.inspect();
          const worryLevel = Math.floor(monkey.operation(item) / 3.0);
          const thresholdReached = worryLevel % monkey.divisor === 0;
          const destinationMonkey = thresholdReached ? monkey.ifTrue : monkey.ifFalse;
          monkeys[destinationMonkey].items.push(worryLevel);
        };
      });
      // console.log(`Round ${i}`);
      // console.log(monkeys.map((monkey, i) => {
      //   return `Monkey: ${i}: ${monkey.items.join(', ')}`
      // }).join('\n'));
      // console.log('');
    }
    return monkeys;
  })
  .then((monkeys) => {
    return monkeys.map((monkey) => {
      return monkey.inspectionCount;
    })
    .sort((a, b) => b - a)
    .slice(0, 2).reduce(product);
  })
  .then((monkeys) => {
    console.log('Part 1: ', monkeys);
  });

makeMonkeys()
  .then((monkeys) => {
    const commonDivisor = monkeys.reduce((a, b) => a * b.divisor, 1)
    for (let i = 0; i < 10000; i++) {
      monkeys.forEach((monkey) => {
        // console.log(monkey)
        while (monkey.items.length > 0) {
          const item = monkey.inspect();
          const worryLevel = monkey.operation(item) % commonDivisor;
          const thresholdReached = worryLevel % monkey.divisor === 0;
          const destinationMonkey = thresholdReached ? monkey.ifTrue : monkey.ifFalse;
          monkeys[destinationMonkey].items.push(worryLevel);
        };
      });
      // if ((i+1) % 1000 === 0 || [0, 19].includes(i)) {
      //   console.log(`Round ${i}`);
      //   console.log(monkeys.map((monkey, i) => {
      //     return `Monkey ${i} inspected items ${monkey.inspectionCount} times`
      //   }).join('\n'));
      //   console.log('');
      // }
    }
    return monkeys;
  })
  .then((monkeys) => {
    return monkeys.map((monkey) => {
      return monkey.inspectionCount;
    })
    .sort((a, b) => b - a)
    .slice(0, 2).reduce(product);
  })
  .then((monkeys) => {
    console.log('Part 2: ', monkeys);
  });
