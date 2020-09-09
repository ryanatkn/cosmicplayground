import App from './App.svelte';
import './main.css';
import './sy.config.js';

const rootElId = 'root';
const root = document.getElementById(rootElId);
if (!root) throw Error(`Cannot find app target element with id '${rootElId}'`);

export const app = new App({
	target: root,
	props: {},
});

(window as any).app = app; // TODO dont do this, or at least handle SSR
