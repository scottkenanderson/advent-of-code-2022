"use strict";
const fs = require('fs');
var Outcomes;
(function (Outcomes) {
    Outcomes[Outcomes["Win"] = 0] = "Win";
    Outcomes[Outcomes["Draw"] = 1] = "Draw";
    Outcomes[Outcomes["Loss"] = 2] = "Loss";
    Outcomes[Outcomes["Unknown"] = 3] = "Unknown";
})(Outcomes || (Outcomes = {}));
;
const outcomeScores = {
    [Outcomes.Win]: 6,
    [Outcomes.Draw]: 3,
    [Outcomes.Loss]: 0,
    [Outcomes.Unknown]: 0,
};
var Shapes;
(function (Shapes) {
    Shapes[Shapes["Rock"] = 0] = "Rock";
    Shapes[Shapes["Paper"] = 1] = "Paper";
    Shapes[Shapes["Scissors"] = 2] = "Scissors";
    Shapes[Shapes["Unknown"] = 3] = "Unknown";
})(Shapes || (Shapes = {}));
;
const shapeScores = {
    [Shapes.Rock]: 1,
    [Shapes.Paper]: 2,
    [Shapes.Scissors]: 3,
    [Shapes.Unknown]: 0,
};
const shapeMapping = {
    A: Shapes.Rock,
    X: Shapes.Rock,
    B: Shapes.Paper,
    Y: Shapes.Paper,
    C: Shapes.Scissors,
    Z: Shapes.Scissors,
};
const desiredOutcome = {
    X: Outcomes.Loss,
    Y: Outcomes.Draw,
    Z: Outcomes.Win,
};
const outcome = (opponent, player) => {
    if (player === Shapes.Rock) {
        if (opponent === Shapes.Rock) {
            return Outcomes.Draw;
        }
        if (opponent === Shapes.Paper) {
            return Outcomes.Loss;
        }
        if (opponent === Shapes.Scissors) {
            return Outcomes.Win;
        }
    }
    if (player === Shapes.Paper) {
        if (opponent === Shapes.Rock) {
            return Outcomes.Win;
        }
        if (opponent === Shapes.Paper) {
            return Outcomes.Draw;
        }
        if (opponent === Shapes.Scissors) {
            return Outcomes.Loss;
        }
    }
    if (player === Shapes.Scissors) {
        if (opponent === Shapes.Rock) {
            return Outcomes.Loss;
        }
        if (opponent === Shapes.Paper) {
            return Outcomes.Win;
        }
        if (opponent === Shapes.Scissors) {
            return Outcomes.Draw;
        }
    }
    return Outcomes.Unknown;
};
const neededResult = (opponent, outcome) => {
    if (opponent === Shapes.Paper) {
        switch (outcome) {
            case Outcomes.Win: return Shapes.Scissors;
            case Outcomes.Draw: return Shapes.Paper;
            case Outcomes.Loss: return Shapes.Rock;
        }
    }
    if (opponent === Shapes.Scissors) {
        switch (outcome) {
            case Outcomes.Win: return Shapes.Rock;
            case Outcomes.Draw: return Shapes.Scissors;
            case Outcomes.Loss: return Shapes.Paper;
        }
    }
    if (opponent === Shapes.Rock) {
        switch (outcome) {
            case Outcomes.Win: return Shapes.Paper;
            case Outcomes.Draw: return Shapes.Rock;
            case Outcomes.Loss: return Shapes.Paper;
        }
    }
    return Shapes.Unknown;
};
const filePromise = () => (new Promise((resolve, reject) => {
    const filename = process.argv[2];
    fs.readFile(filename, 'utf8', (err, data) => {
        resolve(data.split("\n"));
    });
}));
filePromise()
    .then((data) => (data.map((line) => line.split(" "))))
    .then((strategyGuide) => {
    const outcomes = strategyGuide.map(([opponent, player]) => [shapeMapping[opponent], shapeMapping[player]]).map(([opponent, player]) => ({ result: outcome(opponent, player), player })).map(({ result, player }) => outcomeScores[result] + shapeScores[player]).reduce((prev, cur) => prev + cur);
    console.log(`Part 1: ${outcomes}`);
});
filePromise()
    .then((data) => (data.map((line) => line.split(" "))))
    .then(x => {
    console.log(x);
    return x;
})
    .then((strategyGuide) => {
    const outcomes = strategyGuide.map(([opponent, outcome]) => ({ opponentShape: shapeMapping[opponent], result: desiredOutcome[outcome] })).map(x => {
        console.log(x);
        return x;
    }).map(({ opponentShape, result }) => ({ player: neededResult(opponentShape, result), result })).map(x => {
        console.log(x);
        return x;
    }).map(({ result, player }) => outcomeScores[result] + shapeScores[player]).map(x => {
        console.log(x);
        return x;
    }).reduce((prev, cur) => prev + cur);
    console.log(`Part 2: ${outcomes}`);
});
