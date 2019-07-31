// import './main.css'; TODOOOOOOOOOO omitted for testing
// import App from './AppTESTMinimal.svelte';
// import App from './AppTESTMinimalExpression.svelte';
// import App from './AppTESTMinimalChildren.svelte';
// import App from './AppTESTNestedChildren.svelte';
// import App from './AppTESTChildrenSpread.svelte';
// import App from './AppTESTModule.svelte';
// import App from './AppTESTMinimalMarkup.svelte';
// import App from './AppTESTParent.svelte';
// import App from './AppTESTIf.svelte';
// import App from './AppTESTIfElse.svelte';
// import App from './AppTESTIfElseIf.svelte';
// import App from './AppTESTIfComplex.svelte';
// import App from './AppTESTEach.svelte';
// import App from './AppTESTEachComplex.svelte';
// import App from './AppTESTAwait.svelte';
// import App from './AppTESTAwaitPending.svelte';
// import App from './AppTESTAwaitCatch.svelte';
// import App from './AppTESTAwaitFn.svelte';
import App from './AppTESTAwaitNested.svelte';
// import './sy.config.js'; TODOOOOOOOOOO omitted for testing

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
