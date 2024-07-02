import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [vitePreprocess()],
	compilerOptions: {runes: true},
	// TODO ideally this would use the default but it conflicts with ctrl+shift+c in Chrome,
	// but it's strange to me that I'm resetting it to what the Mac default is
	vitePlugin: {inspector: {toggleKeyCombo: 'meta-shift'}}, // docs: https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/inspector.md
	kit: {
		adapter: adapter(),
		alias: {$routes: 'src/routes', $fixtures: 'src/fixtures'},
	},
};
