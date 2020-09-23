import {Plugin} from 'rollup';
import {gray, blue} from '@feltcoop/gro/dist/colors/terminal.js';
import {outputFile} from '@feltcoop/gro/dist/fs/nodeFs.js';
import {omitUndefined} from '@feltcoop/gro/dist/utils/object.js';

import {LogLevel, logger} from '../logger.js';
import {toBundleData, BundleData} from '../../bundle/bundleData.js';

export interface Options {
	srcPath: string;
	externalsPath: string;
	output: string | ((bundleString: string, bundle: BundleData) => Promise<void>);
	logLevel: LogLevel;
}
export type RequiredOptions = 'srcPath' | 'externalsPath';
export type InitialOptions = PartialExcept<Options, RequiredOptions>;
export const initOptions = (opts: InitialOptions): Options => ({
	output: 'bundle.json',
	logLevel: LogLevel.Info,
	...omitUndefined(opts),
});

export const name = 'bundle-writer';

export const bundleWriterPlugin = (opts: InitialOptions): Plugin => {
	const {srcPath, externalsPath, output, logLevel} = initOptions(opts);

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
