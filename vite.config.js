import {sveltekit} from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['@feltjs/felt-ui', '@feltcoop/dealt'],
	},
	build: {
		chunkSizeWarningLimit: 550,
	},
};

export default config;
