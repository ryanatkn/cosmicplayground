import {derived} from 'svelte/store';
import {tweened} from 'svelte/motion';

import {svelteEasings} from './easings';

// This is a custom store that internally uses a `derived` store
// to compose a dynamic list of tweens based on the provided
// easing function names.
// TODO optimize to not use N tweens by rewriting `tweened`
export const createTweens = (
	duration: number,
	easings = svelteEasings,
	initialValue = 0,
) => {
	//console.log('create tweens, duration:', duration);
	// {duration: number, easing: Function}[]
	let tweens = easings.map(easing =>
		tweened(initialValue, {duration, easing: easing.fn}),
	);

	// TODO I think the Svelte `Stores` type needs fixing
	// declare type Stores = Readable<any> |[Readable<any>, ...Array<Readable<any>>];
	// => change to
	// declare type Stores = Readable<any> | Readable<any>[];
	const {subscribe} = derived(
		tweens as any,
		(($tweens: number[]) => {
			$tweens.map((value, i) => ({
				value,
				name: easings[i].name,
			}));
		}) as any,
	); // TODO this is gnarly typing

	return {
		subscribe,
		easings,
		// TODO options type
		set: (value: number, options: any) => {
			//console.log('setting value for tweens:', value, options);
			const promises = tweens.map(t => t.set(value, options));
			return promises;
		},
	};
};
