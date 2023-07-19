import {sveltekit} from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	ssr: {noExternal: ['@feltjs/felt-ui', '@feltcoop/dealt']},
	build: {
		chunkSizeWarningLimit: 550,
	},
};

export default config;
