import type {Writable} from 'svelte/store';
import type {ActionReturn} from 'svelte/action';

// TODO this and `resized.ts` aren't being used anywhere yet, maybe delete

// Simple action that uses `ResizeObserver` to measure its DOM element's bounding rect,
// as an alternative to using `bind:clientWidth` and height,
// returning the bounding rect dimensions instead of the client dimensions.
// For more see: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
// and https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth

// TODO name? `observeBoundingRect`?

export type Measurer = Writable<DOMRect> | ((rect: DOMRect, el: Element) => void);

export const measure = (el: Element, storeOrCb: Measurer): ActionReturn<Measurer> => {
	const update = () => {
		if (typeof storeOrCb === 'function') {
			storeOrCb(el.getBoundingClientRect(), el);
		} else {
			storeOrCb.set(el.getBoundingClientRect());
		}
	};
	const resizeObserver = new ResizeObserver(() => update());
	resizeObserver.observe(el);
	return {
		update: (m: Measurer) => {
			if (m === storeOrCb) return;
			storeOrCb = m; // eslint-disable-line no-param-reassign
			update();
		},
		destroy: () => {
			resizeObserver.unobserve(el);
		},
	};
};
