import {typescript} from 'svelte-preprocess-esbuild';
import static_adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV !== 'production';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: typescript(),
	compilerOptions: {
		immutable: true,
	},
	kit: {
		adapter: static_adapter(),
		target: '#root',
		files: {assets: 'src/static'},
		prerender: {
			// TODO delete all of this now?
			entries: [
				'/404', // TODO temporary hack: https://github.com/sveltejs/kit/issues/1209
				'/',
				'/about',
				'/deep-breath',
				'/starlit-hammock',
				'/easings-2',
				'/paint-freqs',
				'/easings-1',
				'/hearing-test',
				'/under-construction',
				'/freq-speeds',
				'/transition-designer',
				'/clocks',
				'/freq-spectacle',
			],
		},
		vite: {
			ssr: {
				noExternal: ['@feltcoop/felt'],
			},
			optimizeDeps: {
				exclude: ['@feltcoop/felt'],
			},
		},
	},
};
