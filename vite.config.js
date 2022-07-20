import {sveltekit} from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		port: 3000,
	},
	ssr: {
		noExternal: ['@feltcoop/felt'],
	},
	optimizeDeps: {
		exclude: ['@feltcoop/felt'],
	},
};

export default config;
