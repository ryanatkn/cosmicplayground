import {join} from 'path';
import {paths as defaultPaths} from '@feltcoop/gro/dist/paths.js';

export const paths = {
	...defaultPaths,
	assets: join(defaultPaths.source, 'assets/'),
	externals: join(defaultPaths.root, 'node_modules'),
	staticJsStats: join(defaultPaths.dist, 'bundle.stats.json'),
};
