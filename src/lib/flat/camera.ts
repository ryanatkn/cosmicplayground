import {writable, type Writable} from 'svelte/store';
import {getContext, setContext} from 'svelte';

// TODO merge with `clockStore`

export interface CameraState {
	x: number;
	y: number;
	scale: number;
	width: number;
	height: number;
}

export interface CameraStore {
	subscribe: Writable<CameraState>['subscribe'];
	set: Writable<CameraState>['set'];
	update: Writable<CameraState>['update'];
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

	const {subscribe, set, update} = writable(finalInitialState);

	const store: CameraStore = {
		subscribe,
		set,
		update,
		zoom: (amount): void => {
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
