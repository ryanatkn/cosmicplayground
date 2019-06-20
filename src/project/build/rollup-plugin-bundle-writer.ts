import {Plugin, OutputChunk, OutputAsset, OutputBundle} from 'rollup';
import {gray, blue} from 'kleur';
import {outputFile} from 'fs-extra';

import {assignDefaults} from '../../utils/obj';
import {LogLevel, logger} from '../logger';

type OutputKeys = keyof OutputChunk | keyof OutputAsset;
type PartialOutputBundle = PartialValues<OutputBundle>;
type PartialChunkOrAsset = Partial<OutputAsset> | Partial<OutputChunk>; // TODO extract from values of `PartialOutputBundle`?

export interface PluginOptions {
	output:
		| string
		| ((bundleString: string, bundle: OutputBundle) => Promise<void>);
	outputKeys: OutputKeys[];
	logLevel: LogLevel;
}
export type RequiredPluginOptions = never;
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = (): PluginOptions => ({
	output: 'bundle.json',
	outputKeys: [
		// TODO some interesting possibilities here..
		// 'code',
		// 'map',
		'dynamicImports',
		'exports',
		'facadeModuleId',
		'fileName',
		'imports',
		'isDynamicEntry',
		'isEntry',
		'modules',
		'name',
		'isAsset',
		'source',
	],
	logLevel: LogLevel.Info,
});

const name = 'bundle-writer';

export const bundleWriterPlugin = (
	pluginOptions: InitialPluginOptions = {},
): Plugin => {
	const {output, outputKeys, logLevel} = assignDefaults(
		defaultPluginOptions(),
		pluginOptions,
	);
	const {info} = logger(logLevel, [gray(`[${name}]`)]);

	return {
		name,
		async writeBundle(bundle) {
			info(blue('writeBundle'));
			const result: PartialOutputBundle = {};
			for (const name in bundle) {
				const resultChunkOrAsset: PartialChunkOrAsset = (result[name] = {});
				const chunkOrAsset = bundle[name];
				for (const key of outputKeys) {
					// TODO types? `pick` generic obj fn?
					if (chunkOrAsset.hasOwnProperty(key)) {
						(resultChunkOrAsset as any)[key] = (chunkOrAsset as any)[key];
					}
				}
			}
			const str = JSON.stringify(result, null, 2);
			if (typeof output === 'function') {
				await output(str, bundle);
				return;
			}
			await outputFile(output, str);
		},
	};
};
