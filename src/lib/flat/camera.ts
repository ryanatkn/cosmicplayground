import {getContext, setContext} from 'svelte';
import {spring, type Spring} from 'svelte/motion';

// TODO merge with `clockStore`

export interface CameraState {
	x: number;
	y: number;
	scale: number;
	width: number;
	height: number;
}

export interface CameraStore extends Spring<CameraState> {
	zoom: (amount: number) => void;
}

export const toCameraStore = (initialState?: Partial<CameraState>): CameraStore => {
	const finalInitialState: CameraState = {
		x: 0,
		y: 0,
		scale: 1,
		width: 0,
		height: 0,
		...initialState,
	};

	const store: CameraStore = {
		...spring(finalInitialState, {
			stiffness: 0.006,
			damping: 0.12,
		}),
		zoom: (amount) => {
			console.log(`zoom amount`, amount);
			// if (get(store).running) {
			// 	store.pause();
			// } else {
			// 	store.resume();
			// }
		},
	};

	return store;
};

const KEY = Symbol();
export const getCamera = (): CameraStore => getContext(KEY);
export const setCamera = (clock: CameraStore = toCameraStore()): CameraStore => (
	setContext(KEY, clock), clock
);
