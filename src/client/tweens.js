import {derived} from 'svelte/store';
import {tweened} from 'svelte/motion';
import * as easing from 'svelte/easing';

// This is a custom store that internally uses a `derived` store
// to compose a dynamic list of tweens based on the provided
// easing function names. I'm curious if there are nicer or better
// performing ways of doing this.
export const createTweens = (duration, names = getDefaultEasingNames()) => {
	//console.log('create tweens, duration:', duration);
	let tweens = names.map(name =>
		tweened(1, {
			duration,
			easing: easing[name],
		}),
	);

	const {subscribe} = derived(tweens, $tweens =>
		$tweens.map((value, i) => ({
			value,
			name: names[i],
		})),
	);

	return {
		subscribe,
		names,
		set: (value, options) => {
			//console.log('setting value for tweens:', value, options);
			tweens.forEach(t => t.set(value, options));
		},
	};
};

const getDefaultEasingNames = () => {
	const names = Object.keys(easing).filter(
		n => !['default', '__moduleExports'].includes(n),
	); // eww
	// put 'linear' first as a baseline comparison
	return names.includes('linear')
		? ['linear', ...names.filter(n => n !== 'linear')]
		: names;
};
