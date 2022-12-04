const fs = require('fs');

const filePromise = () => (new Promise<Array<string>>((resolve, reject) => {
  const filename = process.argv[2];
  fs.readFile(filename, 'utf8', (err: unknown, data: string) => {
    resolve(data.split("\n"));
  })
}));

const sum = (a: number, b: number): number => a + b;

export default {
  filePromise,
  sum,
}