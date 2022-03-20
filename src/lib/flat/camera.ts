import {getContext, setContext} from 'svelte';
import {spring} from 'svelte/motion';
import {derived, type Readable} from 'svelte/store';

export interface BaseCameraState {
	x: number;
	y: number;
	scale: number; // TODO unimplemented (though used in a few places, but may be incorrect)
	width: number;
	height: number;
}

export interface CameraState extends BaseCameraState {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface CameraStore extends Readable<CameraState> {
	zoom: (amount: number) => void;
	setPosition: (x: number, y: number) => void;
	setDimensions: (width: number, height: number) => void;
}

export const toCameraStore = (initialState?: Partial<BaseCameraState>): CameraStore => {
	const finalInitialState: BaseCameraState = {
		x: 0,
		y: 0,
		scale: 1,
		width: 0,
		height: 0,
		...initialState,
	};

	// TODO make this more customizable
	const state = spring(finalInitialState, {
		stiffness: 0.006,
		damping: 0.12,
	});

	const {subscribe} = derived(state, ($state) => {
		const left = $state.x - $state.width / 2;
		const top = $state.y - $state.height / 2;
		return {
			...$state,
			left,
			right: left + $state.width,
			top,
			bottom: top + $state.height,
		};
	});

	const store: CameraStore = {
		subscribe,
		zoom: (amount) => {
			console.log(`zoom amount`, amount);
		},
		setPosition: (x, y) => {
			state.update(($camera) => ({...$camera, x, y})); // eslint-disable-line @typescript-eslint/no-floating-promises
		},
		setDimensions: (width, height) => {
			// TODO , {hard: true} ? was being used
			state.update(($camera) => ({...$camera, width, height})); // eslint-disable-line @typescript-eslint/no-floating-promises
		},
	};

	return store;
};

const KEY = Symbol();
export const getCamera = (): CameraStore => getContext(KEY);
export const setCamera = (clock: CameraStore = toCameraStore()): CameraStore => (
	setContext(KEY, clock), clock
);
