import * as easing from 'svelte/easing';

const getSvelteEasings = () => {
	const easings = Object.keys(easing).filter(
		n => !['default', '__moduleExports'].includes(n),
	); // eww
	// put 'linear' first as a baseline comparison
	const names = easings.includes('linear')
		? ['linear', ...easings.filter(n => n !== 'linear')]
		: easings;
	return names.map(name => Object.freeze({name, fn: easing[name]}));
};

export const svelteEasings = getSvelteEasings();
