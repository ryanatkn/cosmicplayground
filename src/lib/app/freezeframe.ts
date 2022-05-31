import type {ActionReturn} from 'svelte/action';

import {memoize} from '$lib/util/memoize';

export type Options = boolean;

const dataUrlCache: Map<any, string> = new Map();

let canvas: HTMLCanvasElement;
const getCanvas = (): HTMLCanvasElement => canvas || (canvas = document.createElement('canvas'));

const draw = (canvas: HTMLCanvasElement, img: HTMLImageElement): string => {
	const ctx = canvas.getContext('2d');
	if (!ctx) throw Error('failed to get canvas context');
	const height = img.naturalHeight;
	const width = img.naturalWidth;
	canvas.width = width;
	canvas.height = height;
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL();
};

export const freezeframe = (img: HTMLImageElement, freeze: Options): ActionReturn<Options> => {
	// TODO BLOCK fix so this handles changes, at least on updates
	const src = img.src;

	const toDataUrl = () => memoize(dataUrlCache, src, () => draw(getCanvas(), img));

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
