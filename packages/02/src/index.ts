import { filePromise, sum } from 'aoc-utils';

enum Outcomes {
  Win,
  Draw,
  Loss,
};

const outcomeScores: {[key in Outcomes]: number} = {
  [Outcomes.Win]: 6,
  [Outcomes.Draw]: 3,
  [Outcomes.Loss]: 0,
};

enum Shapes {
  Rock,
  Paper,
  Scissors,
};

const shapeScores = {
  [Shapes.Rock]: 1,
  [Shapes.Paper]: 2,
  [Shapes.Scissors]: 3,
};

const shapeMapping: {[key: string]: Shapes} = {
  A: Shapes.Rock,
  X: Shapes.Rock,
  B: Shapes.Paper,
  Y: Shapes.Paper,
  C: Shapes.Scissors,
  Z: Shapes.Scissors,
};

const desiredOutcome: {[key: string]: Outcomes} = {
  X: Outcomes.Loss,
  Y: Outcomes.Draw,
  Z: Outcomes.Win,
};

const outcome = (opponent: Shapes, player: Shapes): Outcomes => {
  if (player === Shapes.Rock) {
    switch (opponent) {
      case Shapes.Rock: return Outcomes.Draw;
      case Shapes.Paper: return Outcomes.Loss;
      case Shapes.Scissors: return Outcomes.Win;
    }
  }
  if (player === Shapes.Paper) {
    switch (opponent) {
      case Shapes.Rock: return Outcomes.Win;
      case Shapes.Paper: return Outcomes.Draw;
      case Shapes.Scissors: return Outcomes.Loss;
    }
  }
  if (player === Shapes.Scissors) {
    switch (opponent) {
      case Shapes.Rock: return Outcomes.Loss;
      case Shapes.Paper: return Outcomes.Win;
      case Shapes.Scissors: return Outcomes.Draw;
    }
  }
  throw new Error("Unknown shape!")
};

const neededResult = (opponent: Shapes, outcome: Outcomes) => {
  if (opponent === Shapes.Paper) {
    switch(outcome) {
      case Outcomes.Win: return Shapes.Scissors;
      case Outcomes.Draw: return Shapes.Paper;
      case Outcomes.Loss: return Shapes.Rock;
    }
  }
  if (opponent === Shapes.Scissors) {
    switch(outcome) {
      case Outcomes.Win: return Shapes.Rock;
      case Outcomes.Draw: return Shapes.Scissors;
      case Outcomes.Loss: return Shapes.Paper;
    }
  }
  if (opponent === Shapes.Rock) {
    switch(outcome) {
      case Outcomes.Win: return Shapes.Paper;
      case Outcomes.Draw: return Shapes.Rock;
      case Outcomes.Loss: return Shapes.Scissors;
    }
  }
  throw new Error("Unknown outcome!")
}

filePromise()
  .then((data) => (data.map((line) => line.split(" "))))
  .then((strategyGuide) => {
    const outcomes = strategyGuide.map(
      ([opponent, player]) => [shapeMapping[opponent], shapeMapping[player]],
    ).map(
      ([opponent, player]) => ({ result: outcome(opponent, player), player })
    ).map(
      ({ result, player }) => outcomeScores[result] + shapeScores[player]
    ).reduce(sum);
    console.log(`Part 1: ${outcomes}`);
  });

filePromise()
  .then((data) => (data.map((line) => line.split(" "))))
  .then((strategyGuide) => {
    const outcomes = strategyGuide.map(
      ([opponent, outcome]) => ({
        opponentShape: shapeMapping[opponent],
        result: desiredOutcome[outcome],
      }),
    ).map(
      ({ opponentShape, result }) => ({ player: neededResult(opponentShape, result), result })
    ).map(
      ({ result, player }) => outcomeScores[result] + shapeScores[player]
    ).reduce(sum);
    console.log(`Part 2: ${outcomes}`);
  });
