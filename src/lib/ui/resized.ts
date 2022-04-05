import type {Writable} from 'svelte/store';
import type {ActionReturn} from 'svelte/action';

// TODO this and `measure.ts` aren't being used anywhere yet, maybe delete

// Simple action that uses `ResizeObserver` to measure its DOM element
// as an alternative to using `bind:clientWidth` and height.
// For more see: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver

// TODO name? `observeResize`?

export type Resized =
	| Writable<ResizeObserverEntry[]>
	| ((entries: ResizeObserverEntry[], el: Element) => void);

export const resized = (el: Element, storeOrCb: Resized): ActionReturn<Resized> => {
	let lastEntries: ResizeObserverEntry[] | undefined;
	const update = (entries = lastEntries) => {
		if (!entries) return;
		if (typeof storeOrCb === 'function') {
			storeOrCb(entries, el);
		} else {
			storeOrCb.set(entries);
		}
		lastEntries = entries;
	};
	const resizeObserver = new ResizeObserver((entries) => update(entries));
	resizeObserver.observe(el);
	return {
		update: (m: Resized) => {
			if (m === storeOrCb) return;
			storeOrCb = m; // eslint-disable-line no-param-reassign
			update();
		},
		destroy: () => {
			resizeObserver.unobserve(el);
			lastEntries = undefined;
		},
	};
};
