/*

Svelte's `bind:clientWidth`/`bind:clientHeight` strategy
does not take scrollbars into account,
so instead we'll rely on `ResizeObserver` to measure DOM elements.

TODO perf test demo with this action vs `bind:clientHeight`

*/

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const resizer = (el: HTMLElement, cb: ResizeObserverCallback) => {
	const resizeObserver = new ResizeObserver(cb);
	resizeObserver.observe(el);
	return {
		destroy: () => {
			resizeObserver.unobserve(el);
		},
	};
};
