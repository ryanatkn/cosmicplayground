import * as fp from 'path';

import {resolvePath} from './scriptUtils';

const createPaths = () => {
	const root = resolvePath('./');
	const appBuild = fp.join(root, 'build');
	const appBuildDist = fp.join(appBuild, 'dist');
	const appStatic = fp.join(root, 'static');
	return {
		root,
		appBuild,
		appBuildDist,
		appBuildDistClient: fp.join(appBuildDist, 'client'),
		appStatic,
		appStaticJs: fp.join(appStatic, 'bundle.js'),
		appSrc: fp.join(root, 'src'),
	};
};

export const paths = createPaths();

export const srcPath = (path: string): string =>
	path.startsWith(paths.appSrc) ? path.slice(paths.appSrc.length - 3) : path;
