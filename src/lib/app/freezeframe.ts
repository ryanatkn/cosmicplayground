import type {ActionReturn} from 'svelte/action';

import {memoize} from '$lib/util/memoize';
import {toImageDataUrl} from '$lib/util/dom';

export type Options = boolean;

const dataUrlCache: Map<any, string> = new Map();

let canvas: HTMLCanvasElement;
const getCanvas = (): HTMLCanvasElement => canvas || (canvas = document.createElement('canvas'));

export const freezeframe = (img: HTMLImageElement, freeze: Options): ActionReturn<Options> => {
	// TODO BLOCK fix so this handles changes, at least on updates
	const src = img.src;

	const toDataUrl = () => {
		console.log(`toDataUrl src`, src);
		return memoize(dataUrlCache, src, () => toImageDataUrl(getCanvas(), img));
	};

	if (freeze) {
		img.src = toDataUrl();
	}

	return {
		update: (freeze) => {
			if (freeze) {
				img.src = toDataUrl();
			} else {
				img.src = src;
			}
		},
	};
};
