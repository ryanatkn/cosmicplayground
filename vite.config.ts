import type {UserConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	ssr: {noExternal: ['@fuz.dev/fuz', '@ryanatkn/dealt']},
};

export default config;
