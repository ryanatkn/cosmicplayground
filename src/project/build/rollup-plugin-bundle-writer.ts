import {Plugin} from 'rollup';
import {gray, blue} from 'kleur';
import {outputFile} from 'fs-extra';

import {LogLevel, logger} from '../logger';
import {toBundleData, BundleData} from '../../bundle/bundleData';
import {omitUndefined} from '../../utils/obj';

export interface PluginOptions {
	srcPath: string;
	externalsPath: string;
	output: string | ((bundleString: string, bundle: BundleData) => Promise<void>);
	logLevel: LogLevel;
}
export type RequiredPluginOptions = 'srcPath' | 'externalsPath';
export type InitialPluginOptions = PartialExcept<PluginOptions, RequiredPluginOptions>;
export const defaultPluginOptions = (initialOptions: InitialPluginOptions): PluginOptions => ({
	output: 'bundle.json',
	logLevel: LogLevel.Info,
	...omitUndefined(initialOptions),
});

const name = 'bundle-writer';

export const bundleWriterPlugin = (pluginOptions: InitialPluginOptions): Plugin => {
	const {srcPath, externalsPath, output, logLevel} = defaultPluginOptions(pluginOptions);

	const {info} = logger(logLevel, [gray(`[${name}]`)]);

	return {
		name,
		async writeBundle(_outputOptions, bundle) {
			info(blue('writeBundle'), Object.keys(bundle));
			const bundleData = toBundleData(bundle, {srcPath, externalsPath});
			const str = JSON.stringify(bundleData, null, 2);
			if (typeof output === 'function') {
				await output(str, bundleData);
				return;
			}
			await outputFile(output, str);
		},
	};
};
