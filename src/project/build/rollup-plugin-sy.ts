import {Plugin, PluginContext} from 'rollup';
import ck from 'chalk';
import * as fp from 'path';

import {assignDefaults} from '../../utils/obj';
import {noop} from '../../utils/fn';
import {buildStyles} from './buildStyles';
import {replaceExt} from '../scriptUtils';
import {SyBuild} from '../../sy/sy';

/*

`rollup-plugin-sy` looks for imported `sy` config scripts in the rollup build,
runs them to get a `SyBuild`, and forwards the css result into the build,
to be handled like any other imported css files.
The plugin resolves the script id to a virtual css file id,
so the script is not handled like other scripts by rollup or other plugins -
it's ignored beyond the plugin's manual change tracking.

*/

interface PluginOptions {
	configFilenames: string[];
	configExt: string;
	cssExt: string;
	dev: boolean;
	verbose: boolean;
}

type RequiredOptions = 'dev';

const defaultOptions: PluginOptions = {
	configFilenames: ['sy.config'],
	configExt: '.ts',
	cssExt: '.css',
	dev: false,
	verbose: false,
};

export const sy = (
	options: PartialExcept<PluginOptions, RequiredOptions>,
): Plugin => {
	const {dev, configFilenames, configExt, cssExt, verbose} = assignDefaults(
		defaultOptions,
		options,
	);

	const logTag = ck.cyan('[sy]');
	const log = verbose
		? (...args: any[]): void => {
				console.log(logTag, ...args);
		  }
		: noop;
	const logBuildStyles = verbose
		? (...args: any[]): void => {
				console.log(ck.green('[buildStyles]'), ...args);
		  }
		: noop;

	// `path` is the config source file on disk,
	// and `id` is the path with a `.css` ext pointing to a virtual file.
	const pathById = new Map<string, string>();

	// cache used to rebuild only when the path file changes
	const paths = new Set<string>();
	const changedByPath = new Map<string, boolean>();
	const buildByPath = new Map<string, SyBuild>();

	// This hack is needed b/c typescript does not allow `.ts` in import paths,
	// but it does allow importing ts files with the `.js` extension,
	// so we'll just hardcode that in if `configExt` is typescript.
	// ES modules require a file extension so this should be future proof-ish.
	const importeeExt = configExt === '.ts' ? '.js' : configExt;

	// The `basenames` set is used to filter for the importee.
	// Basenames can be 'foo', 'foo.js', or in some nicer future, 'foo.ts'.
	// (or whatever `configExt` is)
	const basenames = new Set<string>();
	if (configExt[0] !== '.') {
		throw Error(`sy configExt must start with a '.': ${configExt}`);
	}
	for (const filename of configFilenames) {
		if (filename.endsWith(configExt)) {
			throw Error(`sy configFilenames must have no extension: ${filename}`);
		}
		if (fp.basename(filename) !== filename) {
			throw Error(`sy configFilenames must have no path: ${filename}`);
		}
		basenames.add(filename);
		basenames.add(filename + configExt);
		if (configExt !== importeeExt) basenames.add(filename + importeeExt);
	}

	return {
		name: 'sy',
		async resolveId(this: PluginContext, importee: string, importer: string) {
			const basename = fp.basename(importee); // foo.js, foo, maybe foo.ts
			if (!basenames.has(basename)) return;

			// This is messy because we need to handle importees
			// like `foo.config` pointing to `foo.config.js`,
			// as well as `.js` importees pointing to typescript.
			const importeeWithoutExt =
				importee.endsWith(configExt) || importee.endsWith(importeeExt)
					? replaceExt(importee, '')
					: importee;
			const importeeWithConfigExt = importeeWithoutExt + configExt;
			const path = fp.resolve(fp.dirname(importer), importeeWithConfigExt);
			paths.add(path);
			changedByPath.set(path, true);

			const id = replaceExt(path, cssExt);
			log('resolved id', id);
			pathById.set(id, path);
			return id;
		},
		async load(this: PluginContext, id: string) {
			if (!pathById.has(id)) return null;
			log('load', id);
			const path = pathById.get(id);
			if (!path) throw Error(`Missing path for id '${id}'`);

			// see `watchChange` hook for `changedByPath` tracking
			this.addWatchFile(path);
			if (!changedByPath.get(path)) {
				const build = buildByPath.get(path);
				if (!build) throw Error(`Missing build for path '${path}'`);
				log('load cached build');
				return build.styles;
			}
			changedByPath.set(path, false);

			log('load new build');
			const build = await buildStyles({
				configPath: path,
				configPartial: {dev},
				dev,
				log: logBuildStyles,
			});
			buildByPath.set(path, build);
			return build.styles;
		},
		watchChange(id: string) {
			if (!paths.has(id)) return;
			// Importantly, this `id` is the `path` to the script file,
			// not the `id` referring to the css file used in the rest of the plugin.
			// See `this.addWatchFile` in the `load` hook.
			log('changed', id);
			changedByPath.set(id, true);
		},
		buildEnd() {
			if (!pathById.size) {
				console.log(
					logTag,
					ck.yellow(
						`warning: no config files were found: ${configFilenames.map(
							n => `'${n + configExt}'`,
						)}`,
					),
				);
			}
		},
	};
};
