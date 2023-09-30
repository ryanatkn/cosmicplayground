import {writable, type Readable} from 'svelte/store';
import {random_float} from '@grogarden/util/random.js';

// This is the old version of the autopanner that relied on CSS transitions for movement.
// The newer version has an `update` function that handles time deltas.

// TODO delete this module?

export interface AutopannerStore extends Readable<AutopannerState> {
	randomize: (
		options?: Partial<AutopannerOptions>,
		forcedTransitionDuration?: number,
		forcedPauseDuration?: number,
	) => void;
}

export interface AutopannerState {
	x: number;
	y: number;
	scale: number;
	options: AutopannerOptions;
	lastTransitionDuration: number;
}

export interface AutopannerOptions {
	width: number;
	height: number;
	imageWidth: number;
	imageHeight: number;
	scaleMin: number;
	scaleMax: number;
	transitionDuration: number;
	pauseDuration: number;
}

export const createAutopannerStore = (options: AutopannerOptions): AutopannerStore => {
	let timeout: any;

	const store = writable<AutopannerState>(
		{
			x: 0,
			y: 0,
			scale: 1,
			options,
			lastTransitionDuration: options.transitionDuration,
		},
		() => {
			return () => {
				clearTimeout(timeout);
			};
		},
	);
	const {subscribe, update} = store;

	const randomize: AutopannerStore['randomize'] = (
		options,
		forcedTransitionDuration,
		forcedPauseDuration,
	) => {
		update((oldState) => {
			const newOptions = {...oldState.options, ...options};
			const newState = {...oldState, options: newOptions};
			const transitionDuration = forcedTransitionDuration ?? newOptions.transitionDuration;
			const pauseDuration = forcedPauseDuration ?? newOptions.pauseDuration;

			newState.lastTransitionDuration = transitionDuration;

			// TODO maybe change the duration based on the distance/scaling to be done?
			// or maybe ensure either/both the scaling/distance factor are significantly different?
			newState.scale = random_float(newOptions.scaleMin, newOptions.scaleMax);
			const scaledImageWidth = newOptions.imageWidth * newState.scale;
			const scaledImageHeight = newOptions.imageHeight * newState.scale;
			const xMin = 0;
			const yMin = 0;
			const xMax = scaledImageWidth - newOptions.width;
			const yMax = scaledImageHeight - newOptions.height;
			newState.x = -random_float(xMin, xMax);
			newState.y = -random_float(yMin, yMax);

			clearTimeout(timeout);
			timeout = setTimeout(() => randomize(), transitionDuration + pauseDuration);
			return newState;
		});
	};

	return {
		subscribe,
		randomize,
	};
};
