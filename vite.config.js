import {sveltekit} from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		port: 3000,
	},
	build: {
		chunkSizeWarningLimit: 550,
	},
};

export default config;
