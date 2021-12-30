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
			// TODO how to pull these from a shared data module?
			entries: [
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
