import {getContext, setContext} from 'svelte';

import {random_float} from '$lib/dealt/util/random';

export const toRandomShadow = (): boolean => random_float() > 0.5;

// TODO either export `shadow` derived store, or otherwise derive it, using `randomBool` with the seeded random number
const SHADOW_KEY = Symbol();
export const setShadow = (initial = toRandomShadow()): void => {
	setContext(SHADOW_KEY, initial);
};
export const getShadow = (): boolean => getContext(SHADOW_KEY);

const SHADOW2_KEY = Symbol();
export const setShadow2 = (initial = toRandomShadow()): void => {
	setContext(SHADOW2_KEY, initial);
};
export const getShadow2 = (): boolean => getContext(SHADOW2_KEY);
