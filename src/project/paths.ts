import * as fp from 'path';

import {resolvePath} from './scriptUtils';

const createPaths = () => {
	const root = resolvePath('./');
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

export const paths = createPaths();
