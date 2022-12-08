import { readFile, sum } from 'aoc-utils';

import { Dir } from './Dir';
import { File } from './File';
import { Command } from './Command';
import { CommandType } from './CommandType';

const isCommand = (line: string): boolean => {
  const commandRegex = /^\$ (?:cd|ls)/;
  return !!line.match(commandRegex);
}

const isDir = (line: string): boolean => {
  const commandRegex = /^dir /;
  return !!line.match(commandRegex);
}

let root: Dir | null = null;

const readLine = (line: string, currentDir: Dir): Dir => {
  if (isCommand(line)) {
    const [_, type, arg] = line.split(' ')
    const command = new Command(type, arg);
    if (command.type === CommandType.ChangeDirectory) {
      if (command.arg === '/') {
        return root as Dir;
      } else if (command.arg === '..') {
        return currentDir.parent as Dir;
      } else {
        return currentDir.children[command.arg as string] as Dir;
      }
    } else if (command.type === CommandType.List) {

    }
  }
  else {
    const [arg, name] = line.split(' ');
    if (isDir(line)) {
      currentDir.children[name] = new Dir(name, currentDir);
    } else {
      currentDir.children[name] = new File(name, parseInt(arg, 10));
    }
  }
  return currentDir;
}

const MAX_DIR_SIZE = 100000;
const DISK_SIZE = 70000000;
const SPACE_NEEDED = 30000000;

const getChildDirectories = (node: Dir): Dir[] => {
  return Object.values(node.children)
    .filter((c) => c instanceof Dir)
    .map((dir) => dir as Dir);
}

const findDirectorySizes = readFile()
  .then((data) => {
    const rootName = 'root';
    let currentDir = new Dir(rootName, null)
    root = currentDir;
    data.forEach((line) => {
      if (line !== '') {
        currentDir = readLine(line, currentDir);
      }
    })
    return root;
  })
  .then((root) => {
    const directories = []
    const stack = [root]
    while(stack.length > 0) {
      const d = stack.pop();
      directories.push(d);
      const childDirectories = getChildDirectories(d as Dir);
      stack.unshift(...childDirectories);
    }
    return directories;
  })

  findDirectorySizes.then(directories => {
    const total = directories
      .filter((d) => (d?.totalSize() || 0) < MAX_DIR_SIZE)
      .map((d) => (d?.totalSize() || 0))
      .reduce(sum);
    console.log('Part 1: ', total);
  })

  findDirectorySizes.then(directories => {
    const unusedSpace = DISK_SIZE - (root?.totalSize() || 0);
    const spaceNeeded = SPACE_NEEDED - unusedSpace;
    const largeDirectories = directories
      .filter((d) => (d?.totalSize() || 0) >= spaceNeeded)
      .map((d) => (d?.totalSize()))
      .sort();
    console.log('Part 2: ', largeDirectories.shift());
  })
