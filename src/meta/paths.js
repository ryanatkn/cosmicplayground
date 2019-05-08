'use strict';

const fp = require('path');
const fs = require('fs');

const mainDir = fs.realpathSync(process.cwd());
const resolveDir = relativePath => fp.resolve(mainDir, relativePath);

const createPaths = () => {
  const root = resolveDir('./');
  const appBuild = fp.join(root, 'build');
  const appBuildDist = fp.join(appBuild, 'dist');
  const appBuildDistClient = fp.join(appBuildDist, 'client');
  return {root, appBuild, appBuildDist, appBuildDistClient};
};

module.exports = createPaths();
