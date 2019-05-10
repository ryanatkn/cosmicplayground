import minimist from 'minimist';
import ck from 'chalk';

export const argv = minimist(process.argv.slice(2));
export const verbose = argv['verbose'];

export const verboseLog = (...args) => {
  if (!verbose) return;
  console.log(...args);
};

export const handleTaskError = err => {
  console.log(ck.red(`Error: ${err.message}`));
  console.log(ck.yellow(err.stack));
  process.exit(1);
};

const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
export const rainbow = str =>
  str
    .split('')
    .map((char, i) => ck[colors[i % colors.length]](char))
    .join('');
