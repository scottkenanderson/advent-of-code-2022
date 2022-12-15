import {zip} from 'aoc-utils';

type PacketValue = number | number[];

export class Packet {
  value: PacketValue;
  rawValue: string;

  constructor(rawValue = '[]') {
    this.rawValue = rawValue;
    this.value = JSON.parse(rawValue) as PacketValue;
  }

  toString(): string {
    return this.rawValue;
  }
}

type CheckReturn = {
  valid: boolean;
  checkAgain?: boolean;
};

export class Pair {
  left: Packet;
  right: Packet;
  initialLeftValue: string;
  initialRightValue: string;

  constructor(initialLeftValue = '[]', initialRightValue = '[]') {
    this.initialLeftValue = initialLeftValue;
    this.initialRightValue = initialRightValue;
    this.left = new Packet(initialLeftValue);
    this.right = new Packet(initialRightValue);
  }

  toString(): string {
    return `${this.initialLeftValue} ${this.initialLeftValue}`;
  }

  isInTheCorrectOrder(): boolean {
    // Console.log(JSON.stringify(this.left));
    // console.log(JSON.stringify(this.right));

    const {valid, checkAgain} = this.check(this.left.value, this.right.value);

    const result = valid || Boolean(checkAgain);
    // Console.log('result', result);

    return result;
  }

  compare(left: Packet, right: Packet): number {
    const {valid, checkAgain} = this.check(left.value, right.value);
    if (checkAgain) {
      return 0;
    }

    if (valid) {
      return -1;
    }

    return 1;
  }

  private check(left: PacketValue, right: PacketValue): CheckReturn {
    // Console.log('compare', left, 'vs', right);
    if (Array.isArray(left) && Array.isArray(right) && left.length === 0 && right.length === 0) {
      return {valid: false, checkAgain: true};
    }

    if (left === right) {
      return {valid: false, checkAgain: true};
    }

    if (typeof left === 'undefined') {
      return {valid: true, checkAgain: false};
    }

    if (typeof left === 'number') {
      if (typeof right === 'number') {
        return {valid: left < right, checkAgain: left === right};
      }

      if (typeof right === 'undefined') {
        return {valid: false};
      }

      return this.check([left], right);
    }

    if (typeof right === 'number') {
      return this.check(left, [right]);
    }

    if (typeof right === 'undefined') {
      if (typeof left === 'undefined' && typeof right === 'undefined') {
        return {valid: false, checkAgain: true};
      }

      return {valid: false};
    }

    const zipped = zip(left, right);
    let valid = false;
    let checkAgain: boolean | undefined = false;
    let pair = zipped.shift();
    while (pair) {
      ({valid, checkAgain} = this.check(pair[0], pair[1]));
      if (!checkAgain) {
        return {valid, checkAgain};
      }

      pair = zipped.shift();
    }

    return {valid, checkAgain};
  }
}
