import * as fp from 'path';

import {resolvePath} from './scriptUtils';

// TODO we want to reuse these in the client somehow
// what's a good way to do that? abstract these out?
// maybe introduce a build step that transforms
// the relevant paths from here into client versions?
// or maybe extract to shared helpers and take a root path param?

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
		appStaticJsStats: fp.join(appStatic, 'bundle.stats.json'),
		appSrc: fp.join(root, 'src'),
		appExternals: fp.join(root, 'node_modules'),
		svelteCssBundleName: 'bundle.svelte.css',
		syCssBundleName: 'bundle.sy.css',
		plainCssBundleName: 'bundle.plain.css',
	};
};

export const paths = createPaths();
console.log(`paths`, paths);

// TODO this helper is bleh
export const toSrcPath = (path: string): string =>
	path.startsWith(paths.appSrc) ? path.slice(paths.appSrc.length - 3) : path;
