import * as easing from 'svelte/easing';

type EasingName = keyof typeof easing;

const getSvelteEasings = () => {
	const easings = (Object.keys(easing) as EasingName[]).filter(
		(n) => !['default', '__moduleExports'].includes(n),
	); // eww
	// put 'linear' first as a baseline comparison
	const names: EasingName[] = easings.includes('linear')
		? ['linear', ...easings.filter((n) => n !== 'linear')]
		: easings;
	return names.map((name) => Object.freeze({name, fn: easing[name]}));
};

export const svelteEasings = getSvelteEasings();
