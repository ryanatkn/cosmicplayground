import App from './App.svelte';
import './main.css';
import './sy.config.js';

// TODO inject with rollup
if (!window.process) {
	(window as any).process = {env: {NODE_ENV: 'development'}};
}

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
