'use strict';

const fp = require('path');
const fs = require('fs');

const mainDir = fs.realpathSync(process.cwd());
const resolveDir = relativePath => fp.resolve(mainDir, relativePath);

const createPaths = () => {
  const root = resolveDir('./');
  const appBuild = fp.join(root, 'build');
  const appBuildDist = fp.join(appBuild, 'dist');
  return {
    root,
    appBuild,
    appBuildDist,
    appBuildDistClient: fp.join(appBuildDist, 'client'),
    appStatic: fp.join(root, 'static'),
    appSrc: fp.join(root, 'src'),
  };
};

module.exports = createPaths();
