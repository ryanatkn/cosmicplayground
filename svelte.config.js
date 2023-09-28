//@ts-expect-error
import {typescript} from 'svelte-preprocess-esbuild';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: typescript(),
	compilerOptions: {immutable: true},
	vitePlugin: {inspector: true}, // docs: https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/inspector.md
	kit: {
		adapter: adapter(),
		files: {assets: 'src/static'},
		alias: {$routes: 'src/routes', $fixtures: 'src/fixtures'},
	},
};
