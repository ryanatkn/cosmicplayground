import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [vitePreprocess()],
	compilerOptions: {immutable: true},
	vitePlugin: {inspector: true},
	kit: {
		adapter: adapter(),
		alias: {$routes: 'src/routes', $fixtures: 'src/fixtures'},
	},
};
