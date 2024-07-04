import type {ActionReturn} from 'svelte/action';

import {fromCache} from '$lib/cache';
import {toImageDataUrl} from '$lib/dom.js';

export type Options = boolean;

const dataUrlBySrc: Map<any, string> = new Map();

let canvas: HTMLCanvasElement;
const getCanvas = (): HTMLCanvasElement => canvas || (canvas = document.createElement('canvas'));

// TODO this doesn't handle `img.src` changes,
// so for now wrap images with `{#key src}` if it needs to be dynamic.
// proper fix: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

/**
 * When `freeze` is `true`, draws the image to a data URL, so gifs become a static image.
 * @param img
 * @param freeze
 * @returns action
 */
export const freezeframe = (img: HTMLImageElement, freeze: Options): ActionReturn<Options> => {
	let _freeze = freeze;
	const originalSrc = img.src;

	let loaded = false;
	const onLoad = () => {
		loaded = true;
		if (_freeze) img.src = toDataUrl();
	};
	img.addEventListener('load', onLoad);

	const toDataUrl = () =>
		fromCache(dataUrlBySrc, originalSrc, () => toImageDataUrl(getCanvas(), img));

	return {
		update: (freeze) => {
			_freeze = freeze;
			if (freeze) {
				if (loaded) img.src = toDataUrl();
			} else {
				img.src = originalSrc;
			}
		},
		destroy: () => {
			img.removeEventListener('load', onLoad);
		},
	};
};
