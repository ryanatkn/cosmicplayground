import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

// TODO is this the right module name? `layout`?

export interface Dimensions {
	width: number;
	height: number;
}

const KEY = Symbol('Dimensions');

export const get_dimensions = (): Writable<Dimensions> => getContext(KEY);

export const set_dimensions = (dimensions: Writable<Dimensions>): Writable<Dimensions> =>
	setContext(KEY, dimensions);
