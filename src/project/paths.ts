import * as fp from 'path';
import {gray} from 'kleur';

import {resolvePath} from './scriptUtils';
import {logger, LogLevel} from './logger';

const {info} = logger(LogLevel.Info, [gray('[paths]')]); // TODO log level from env var? param?

// TODO we want to reuse these in the client somehow
// what's a good way to do that? abstract these out?
// maybe introduce a build step that transforms
// the relevant paths from here into client versions?
// or maybe extract to shared helpers and take a root path param?

const createPaths = () => {
	const root = resolvePath('./');
	const build = fp.join(root, 'build');
	const buildDist = fp.join(build, 'dist');
	const staticDir = fp.join(root, 'static');
	const src = fp.join(root, 'src');
	const client = fp.join(src, 'client');
	return {
		root,
		build,
		buildDist,
		buildDistClient: fp.join(buildDist, 'client'),
		staticDir, // TODO rename? probably yes when we rework the build process
		staticJs: fp.join(staticDir, 'bundle.js'),
		staticJsStats: fp.join(staticDir, 'bundle.stats.json'),
		src,
		client,
		clientMain: fp.join(client, 'main.ts'),
		externals: fp.join(root, 'node_modules'),
		svelteCssBundleName: 'bundle.svelte.css',
		syCssBundleName: 'bundle.sy.css',
		plainCssBundleName: 'bundle.plain.css',
	};
};

export const paths = createPaths();
info(paths);

// TODO this helper is bleh
export const toRootPath = (path: string): string =>
	path.startsWith(paths.root) ? path.slice(paths.root.length + 1) : path;
