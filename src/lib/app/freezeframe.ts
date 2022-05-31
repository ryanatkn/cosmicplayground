import type {ActionReturn} from 'svelte/action';

export type Options = boolean;

// TODO
// const cache: WeakMap<HTMLImageElement, string> = new WeakMap();

const draw = (canvas: HTMLCanvasElement, img: HTMLImageElement): string => {
	//
	const ctx = canvas.getContext('2d');
	if (!ctx) throw Error('no drawing ctx');
	console.log(`img.getBoundingClientRect()`, img.getBoundingClientRect());
	console.log(`img.getClientRects();`, img.getClientRects());
	const height = img.naturalHeight;
	const width = img.naturalWidth;
	console.log(`width, height`, width, height);
	canvas.width = width;
	canvas.height = height;
	// TODO clearRect is unnecessary right?
	ctx.drawImage(img, 0, 0);
	// const data = ctx.getImageData(0, 0, width, height);
	// console.log(`data`, data);
	return canvas.toDataURL();
};

export const freezeframe = (img: HTMLImageElement, freeze: Options): ActionReturn<Options> => {
	let src: string;
	const toDataUrl = (): string => {
		if (!src) src = img.src;

		const canvas = document.createElement('canvas');
		const str = draw(canvas, img); // TODO BLOCK draw only when needed

		return str;
	};

	return {
		update: (freeze) => {
			console.log('TODO UPDATE', freeze);
			if (freeze) {
				img.src = toDataUrl();
			} else {
				img.src = src;
			}
		},
		destroy: () => {
			console.log('TODO DESTROY');
		},
	};
};
