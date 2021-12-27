import {derived} from 'svelte/store';
import {tweened} from 'svelte/motion';

import {svelteEasings} from '$lib/app/easings.js';

export interface Tween {
	name: string;
	value: number;
}

// This is a custom store that internally uses a `derived` store
// to compose a dynamic list of tweens based on the provided
// easing function names.
// TODO optimize to not use N tweens by rewriting `tweened`
export const createTweens = (duration: number, easings = svelteEasings, initialValue = 0) => {
	//console.log('create tweens, duration:', duration);
	// {duration: number, easing: Function}[]
	let tweens = easings.map((easing) => tweened(initialValue, {duration, easing: easing.fn}));

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
		// TODO options type
		set: (value: number, options: any) => {
			//console.log('setting value for tweens:', value, options);
			const promises = tweens.map((t) => t.set(value, options));
			return promises;
		},
	};
};
