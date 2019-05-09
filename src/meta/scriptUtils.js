const minimist = require('minimist');
const ck = require('chalk');

const argv = (exports.argv = minimist(process.argv.slice(2)));
const verbose = (exports.verbose = argv['verbose']);

exports.verboseLog = (...args) => {
  if (!verbose) return;
  console.log(...args);
};

exports.handleTaskError = err => {
  console.log(ck.red(`Error: ${err.message}`));
  console.log(ck.yellow(err.stack));
  process.exit(1);
};

const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
exports.rainbow = str =>
  str
    .split('')
    .map((char, i) => ck[colors[i % colors.length]](char))
    .join('');
