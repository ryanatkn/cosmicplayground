import type {UserConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	// TODO BLOCK remove this?
	ssr: {noExternal: ['@fuz.dev/fuz']},
};

export default config;
