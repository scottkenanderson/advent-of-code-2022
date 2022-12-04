import fs from 'fs';

export const readFile = (): Promise<Array<string>> => {
  return new Promise<Array<string>>((resolve, reject) => {
    const filename = process.argv[2];
    fs.readFile(filename, 'utf8', (err: unknown, data: string) => {
      resolve(data.split("\n"));
    })
  })
};

export const sum = (a: number, b: number): number => a + b;
