import {derived, type Readable} from 'svelte/store';
import {tweened, type TweenedOptions} from 'svelte/motion';

import {svelteEasings} from '$lib/easings.js';

export interface Tween {
	name: string;
	value: number;
}

export interface Tweens {
	subscribe: Readable<Tween[]>['subscribe'];
	easings: typeof svelteEasings;
	// TODO options type
	set: (value: number, options: TweenedOptions<number> | undefined) => Array<Promise<void>>;
}

// This is a custom store that internally uses a `derived` store
// to compose a dynamic list of tweens based on the provided
// easing function names.
// TODO optimize to not use N tweens by rewriting `tweened`
export const createTweens = (
	duration: number,
	easings = svelteEasings,
	initial_value = 0,
): Tweens => {
	const tweens = easings.map((easing) => tweened(initial_value, {duration, easing: easing.fn}));

	const {subscribe} = derived(
		tweens,
		($tweens: number[]) =>
			$tweens.map((value, i) => ({
				value,
				name: easings[i].name,
			})) as Tween[],
	);

	return {
		subscribe,
		easings,
		set: (value, options) => {
			const promises = tweens.map((t) => t.set(value, options));
			return promises;
		},
	};
};
