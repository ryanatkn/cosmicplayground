import App from './App.svelte';
import './sy.config.js';

const rootElId = 'root';
const root = document.getElementById(rootElId);
if (!root) throw Error(`Cannot find app target element with id '${rootElId}'`);

export const app = new App({
	target: root,
	props: {
		name: 'cosmicplayground',
	},
});

(window as any).app = app;
