import {writable, type Readable} from 'svelte/store';
import {randomFloat} from '@feltcoop/felt/util/random.js';

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
			const newState = {
				...oldState,
				options: {...oldState.options, ...options},
			};
			const transitionDuration = forcedTransitionDuration ?? newState.options.transitionDuration;
			const pauseDuration = forcedPauseDuration ?? newState.options.pauseDuration;

			newState.lastTransitionDuration = transitionDuration;

			// TODO maybe change the duration based on the distance/scaling to be done?
			// or maybe ensure either/both the scaling/distance factor are significantly different?
			newState.scale = randomFloat(newState.options.scaleMin, newState.options.scaleMax);
			const scaledImageWidth = newState.options.imageWidth * newState.scale;
			const scaledImageHeight = newState.options.imageHeight * newState.scale;
			const xMin = 0;
			const yMin = 0;
			const xMax = scaledImageWidth - newState.options.width;
			const yMax = scaledImageHeight - newState.options.height;
			newState.x = -randomFloat(xMin, xMax);
			newState.y = -randomFloat(yMin, yMax);

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