import {sveltekit} from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['@feltcoop/felt'],
	},
	build: {
		chunkSizeWarningLimit: 550,
	},
};

export default config;
