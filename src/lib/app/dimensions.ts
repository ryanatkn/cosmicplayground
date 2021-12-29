import {getContext, setContext} from 'svelte';
import {type Writable} from 'svelte/store';

// TODO is this the right module name? `layout`? `view`?

export interface Dimensions {
	width: number;
	height: number;
}

export const dimensionsContextKey = {};
export const getDimensions = (): Writable<Dimensions> => getContext(dimensionsContextKey);
export const setDimensions = (dimensions: Writable<Dimensions>): Writable<Dimensions> => {
	setContext(dimensionsContextKey, dimensions);
	return dimensions;
};
