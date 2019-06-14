import * as prettier from 'prettier';

import {sy, SyConfig, SyBuild} from '../../sy/sy';
import {assignDefaults} from '../../utils/obj';
import {noop} from '../../utils/fn';

interface BuildStylesOptions {
	configPath: string;
	configPartial: Partial<SyConfig>;
	dev: boolean;
	log: (...args: any[]) => void;
}

type RequiredOptions = 'dev';

const defaultOptions: BuildStylesOptions = {
	configPath: '',
	configPartial: {},
	dev: false,
	log: noop,
};

// This type is the shape of the config file (e.g. `sy.config.ts`).
// It's used to get types for dynamic imports/requires.
export interface SyConfigModule {
	// Callers may include a `configPartial` but any part of it can be ignored.
	// Callers can then further change the returned config if needed.
	createConfig(partial: Partial<SyConfig>): Promise<SyConfig>;
}

export const buildStyles = async (
	options: PartialExcept<BuildStylesOptions, RequiredOptions>,
): Promise<SyBuild> => {
	const {configPath, dev, configPartial, log} = assignDefaults(
		defaultOptions,
		options,
	);
	log('buildStyles');

	delete require.cache[require.resolve(configPath)];
	const configModule: SyConfigModule = require(configPath);

	log('creating config...');
	const config = await configModule.createConfig(configPartial);
	log('created config');

	log('build...');
	const build = sy(config);
	log(
		`build complete
	# defs: ${build.defs.length}
	# lines: ${(build.styles.match(/\n/g) || []).length + 1}
	# characters: ${build.styles.length}`,
	);

	const formattedBuild = dev ? formatBuild(build, log) : build;
	return formattedBuild;
};

const formatBuild = (build: SyBuild, log: Function): SyBuild => {
	log('formatting...');
	// TODO `import` prettier config? pass in as option?
	const prettierConfig: prettier.Options = require('../../../package.json')
		.prettier;
	const formatted = {
		...build,
		styles: prettier.format(build.styles, {parser: 'css', ...prettierConfig}),
	};
	log('format complete');
	return formatted;
};
