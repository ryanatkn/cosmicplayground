import {Plugin} from 'rollup';
import {gray, blue} from 'kleur';
import {outputFile} from 'fs-extra';

import {assignDefaults} from '../../utils/obj';
import {LogLevel, logger} from '../logger';
import {toBundleData, BundleData} from '../../bundle/bundleData';
import {paths} from '../paths';

export interface PluginOptions {
	output:
		| string
		| ((bundleString: string, bundle: BundleData) => Promise<void>);
	logLevel: LogLevel;
}
export type RequiredPluginOptions = never;
export type InitialPluginOptions = PartialExcept<
	PluginOptions,
	RequiredPluginOptions
>;
export const defaultPluginOptions = (): PluginOptions => ({
	output: 'bundle.json',
	logLevel: LogLevel.Info,
});

const name = 'bundle-writer';

export const bundleWriterPlugin = (
	pluginOptions: InitialPluginOptions = {},
): Plugin => {
	const {output, logLevel} = assignDefaults(
		defaultPluginOptions(),
		pluginOptions,
	);
	const {info} = logger(logLevel, [gray(`[${name}]`)]);

	return {
		name,
		async writeBundle(bundle) {
			info(blue('writeBundle'), Object.keys(bundle));
			const bundleData = toBundleData(bundle, {
				srcPath: paths.appSrc,
				externalsPath: paths.appExternals,
			});
			const str = JSON.stringify(bundleData, null, 2);
			if (typeof output === 'function') {
				await output(str, bundleData);
				return;
			}
			await outputFile(output, str);
		},
	};
};
