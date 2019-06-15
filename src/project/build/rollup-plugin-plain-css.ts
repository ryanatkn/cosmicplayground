import {OutputOptions, Plugin, OutputBundle, PluginContext} from 'rollup';
import {outputFile} from 'fs-extra';
import {createFilter} from 'rollup-pluginutils';
import {blue} from 'kleur';

import {assignDefaults} from '../../utils/obj';
import {noop} from '../../utils/fn';

interface PluginOptions {
	output: false | string | ((this: PluginContext, css: string) => void);
	include?: string[];
	exclude?: string[];
	verbose?: boolean;
}

const defaultOptions: PluginOptions = {
	output: '',
	include: ['**/*.css'],
};

export const plainCss = (pluginOptions: PluginOptions): Plugin => {
	const {output, include, exclude, verbose} = assignDefaults(
		defaultOptions,
		pluginOptions,
	);
	const log = verbose
		? (...args: any[]): void => {
				console.log(blue('[plain-css]'), ...args);
		  }
		: noop;
	log(`output`, output);
	const filter = createFilter(include, exclude);

	const styles = new Map<string, string>();
	const changes = new Set();
	const cacheCss = (id: string, code: string) => {
		if (styles.get(id) !== code) {
			log(`caching ${id}`);
			styles.set(id, code);
			changes.add(id);
		}
	};
	const renderCss = () => {
		let css = [];
		for (const style of styles.values()) {
			if (style) css.push(style);
		}
		return css.join('\n');
	};

	return {
		name: 'plain-css',
		transform(this: PluginContext, code: string, id: string) {
			if (!filter(id)) return;
			log(`transform id`, id);
			if (output === false) {
				return {
					code: `export default ${JSON.stringify(code)}`,
					map: {mappings: ''},
				};
			}
			cacheCss(id, code);
			return {
				code: '',
				map: {mappings: ''},
			};
		},
		async generateBundle(
			this: PluginContext,
			_outputOptions: OutputOptions,
			_bundle: OutputBundle,
			isWrite: boolean,
		) {
			if (!isWrite || !output || !changes.size) return;
			changes.clear();
			log('generate bundle', output, isWrite);
			const css = renderCss();
			if (!css) return;
			// log(`outputOptions`, outputOptions);
			if (typeof output === 'function') {
				output.call(this, css);
				return;
			}
			log('write file', output);
			await outputFile(output, css);
		},
	};
};
