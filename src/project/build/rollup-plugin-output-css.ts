import {Plugin, ExistingRawSourceMap} from 'rollup';
import {outputFile} from 'fs-extra';
import {blue} from 'kleur';
import * as fp from 'path';
import {decode, encode, SourceMapSegment} from 'sourcemap-codec';

import {assignDefaults} from '../../utils/obj';
import {LogLevel, logger, fmtVal} from '../logger';
import {toSrcPath} from '../paths';

// TODO upstream rollup type?
export type CssBuild = {
	code: string;
	map: ExistingRawSourceMap | undefined; // TODO review this type - `{mappings: ''}`?
};
export type CssBundle = {
	bundleName: string;
	buildsById: Map<string, CssBuild>;
	changedIds: Set<string>;
};

export interface PluginOptions {
	sourcemap: boolean; // TODO consider per-bundle options
	logLevel: LogLevel;
}
export type RequiredPluginOptions = never;
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = (): PluginOptions => ({
	sourcemap: false,
	logLevel: LogLevel.Info,
});

export interface PlainCssPlugin extends Plugin {
	cacheCss(bundleName: string, id: string, css: string | CssBuild): boolean;
}

export const name = 'output-css';

// TODO this really just outputs css - but it'll probably be refactored
export const outputCssPlugin = (
	pluginOptions: InitialPluginOptions,
): PlainCssPlugin => {
	const {sourcemap, logLevel} = assignDefaults(
		defaultPluginOptions(),
		// {sourcemap: pluginOptions.dev}, // TODO dev flag?
		pluginOptions,
	);
	const {info} = logger(logLevel, [blue(`[${name}]`)]);

	// `bundles` key is an output file name,
	// and the value is css by id.
	// Return a bool indicating if the cache was updated.
	const bundles = new Map<string, CssBundle>();
	const cacheCss = (
		bundleName: string,
		id: string,
		css: string | CssBuild,
	): boolean => {
		let bundle = bundles.get(bundleName);
		if (!bundle) {
			bundle = {bundleName, buildsById: new Map(), changedIds: new Set()};
			bundles.set(bundleName, bundle);
		}

		const build: CssBuild =
			typeof css === 'string' ? {code: css, map: undefined} : css;
		const cachedBuild = bundle.buildsById.get(id);
		// I think this comparison is safe - sourcemap should change if code changes, eh?
		if (build.code === (cachedBuild && cachedBuild.code)) return false;

		info(fmtVal('caching', toSrcPath(id)), fmtVal('bundle', bundleName));
		bundle.buildsById.set(id, build);
		bundle.changedIds.add(id);

		return true;
	};

	return {
		name,
		// TODO rewrite when the emit file API is ready https://github.com/rollup/rollup/issues/2938
		cacheCss,
		async generateBundle(outputOptions, _bundle, isWrite) {
			if (!isWrite) return;

			info('generateBundle');

			// TODO chunks!
			const outFile = outputOptions.file;
			if (!outFile) throw Error(`Expected outputOptions.file: ${outFile}`);
			const outDir = fp.dirname(outFile);

			// write each changed bundle to disk
			for (const {bundleName, buildsById, changedIds} of bundles.values()) {
				if (!changedIds.size) continue;

				info('generating css bundle', blue(bundleName));
				info('changes', changedIds.keys()); // TODO trace when !watch
				changedIds.clear();

				const mappings: SourceMapSegment[][] = [];
				const sources: string[] = [];
				const sourcesContent: string[] = [];

				let cssStrings: string[] = [];
				for (const build of buildsById.values()) {
					if (!build.code) continue;
					cssStrings.push(build.code);

					// add css source map
					// TODO do we we ever want a warning if `build.map` is undefined?
					if (sourcemap && build.map && build.map.sourcesContent) {
						const sourcesLength = sources.length;
						sources.push(build.map.sources[0]);
						sourcesContent.push(build.map.sourcesContent[0]);
						const decoded = decode(build.map.mappings);
						if (sourcesLength > 0) {
							for (const line of decoded) {
								for (const segment of line) {
									segment[1] = sourcesLength;
								}
							}
						}
						mappings.push(...decoded);
					}
				}
				const css = cssStrings.join('\n');

				const dest = fp.join(outDir, bundleName);

				if (sources.length) {
					const sourcemapDest = dest + '.map';
					const finalCss =
						css + `\n/*# sourceMappingURL=${bundleName}.map */\n`;
					const cssSourcemap = JSON.stringify(
						{
							version: 3,
							file: bundleName,
							sources: sources.map(s => fp.relative(outDir, s)),
							sourcesContent,
							names: [],
							mappings: encode(mappings),
						},
						null,
						2,
					);

					info('writing css bundle and sourcemap', dest);
					await Promise.all([
						outputFile(dest, finalCss),
						outputFile(sourcemapDest, cssSourcemap),
					]);
				} else {
					info('writing css bundle', dest);
					await outputFile(dest, css);
				}
			}
		},
	};
};