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
		// TODO probably don't need fallback if we move the `404.html` manually after building:
		// https://github.com/sveltejs/kit/issues/1209
		adapter: static_adapter({fallback: '404.html'}),
		target: '#root',
		files: {assets: 'src/static'},
		prerender: {
			// TODO Keep in sync with `src/lib/portals/index.ts` until we figure out how to share data.
			// This is all necessary because of the dynamic root route `[...slug].svelte`.
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
