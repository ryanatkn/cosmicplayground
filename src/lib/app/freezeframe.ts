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
	console.log('COMPUTE');
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL();
};

export const freezeframe = (img: HTMLImageElement, freeze: Options): ActionReturn<Options> => {
	const src = img.src;
	if (freeze) {
		img.src = memoize(dataUrlCache, src, () => draw(getCanvas(), img));
	}

	return {
		update: (freeze) => {
			console.log('TODO UPDATE', freeze);
			if (freeze) {
				img.src = memoize(dataUrlCache, src, () => draw(getCanvas(), img));
			} else {
				img.src = src;
			}
		},
		destroy: () => {
			console.log('TODO DESTROY');
		},
	};
};
