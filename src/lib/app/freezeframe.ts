import type {ActionReturn} from 'svelte/action';

export type Options = boolean;

const dataUrlCache: Map<any, string> = new Map();

// TODO memoize helper?
export const cacheBy = <TKey, TValue>(
	cache: Map<TKey, TValue>,
	key: TKey,
	compute: () => TValue,
): TValue => {
	if (cache.has(key)) return cache.get(key)!;
	const value = compute();
	cache.set(key, value);
	return value;
};

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
		img.src = cacheBy(dataUrlCache, src, () => draw(getCanvas(), img));
	}

	return {
		update: (freeze) => {
			console.log('TODO UPDATE', freeze);
			if (freeze) {
				img.src = cacheBy(dataUrlCache, src, () => draw(getCanvas(), img));
			} else {
				img.src = src;
			}
		},
		destroy: () => {
			console.log('TODO DESTROY');
		},
	};
};
