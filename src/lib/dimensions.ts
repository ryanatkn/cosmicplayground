import {create_context} from '@ryanatkn/fuz/context_helpers.js';
import type {Writable} from 'svelte/store';

// TODO is this the right module name? `layout`?

export interface Dimensions {
	width: number;
	height: number;
}

export const dimensions_context = create_context<Writable<Dimensions>>();
