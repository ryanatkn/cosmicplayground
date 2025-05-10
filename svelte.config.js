import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import {create_csp_directives} from '@ryanatkn/fuz/csp.js';
import {csp_trusted_sources_of_ryanatkn} from '@ryanatkn/fuz/csp_of_ryanatkn.js';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [vitePreprocess()],
	compilerOptions: {runes: true},
	vitePlugin: {inspector: true},
	kit: {
		adapter: adapter(),
		paths: {relative: false}, // use root-absolute paths: https://kit.svelte.dev/docs/configuration#paths
		alias: {$routes: 'src/routes'},
		csp: {
			directives: create_csp_directives({
				trusted_sources: csp_trusted_sources_of_ryanatkn,
			}),
		},
	},
};
