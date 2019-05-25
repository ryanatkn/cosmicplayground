import {derived} from 'svelte/store';
import {tweened} from 'svelte/motion';

import {svelteEasings} from './easings';

// This is a custom store that internally uses a `derived` store
// to compose a dynamic list of tweens based on the provided
// easing function names.
// TODO optimize to not use N tweens by rewriting `tweened`
export const createTweens = (
	duration,
	easings = svelteEasings,
	initialValue = 0,
) => {
	//console.log('create tweens, duration:', duration);
	let tweens = easings.map(easing =>
		tweened(initialValue, {duration, easing: easing.fn}),
	);

	const {subscribe} = derived(tweens, $tweens =>
		$tweens.map((value, i) => ({
			value,
			name: easings[i].name,
		})),
	);

	return {
		subscribe,
		easings,
		set: (value, options) => {
			//console.log('setting value for tweens:', value, options);
			const promises = tweens.map(t => t.set(value, options));
			return promises;
		},
	};
};
