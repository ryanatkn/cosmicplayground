import {isEditable} from '@feltjs/util/dom.js';
import {tick} from 'svelte';

export const enableGlobalHotkeys = (target: unknown): boolean =>
	!!target && !isEditable(target as any); // TODO upgrade Felt

// TODO upstream to felt, maybe use setTimeout
/**
 * Scrolls smoothly down the page to `top`, or the very bottom if no `top` is provided`.
 * @param top Distance from top in pixels. Defaults to `90000` bc `Infinity` doesn't work and measuring seems wasteful.
 */
export const scrollDown = async (top = 90000): Promise<void> => {
	await tick();
	window.scrollTo({left: window.scrollX, top, behavior: 'smooth'});
};

export const toImageDataUrl = (canvas: HTMLCanvasElement, img: HTMLImageElement): string => {
	const ctx = canvas.getContext('2d');
	if (!ctx) throw Error('failed to get canvas context');
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL();
};
