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
	setPosition: (x: number, y: number, opts?: SpringUpdateOpts | undefined) => Promise<void>;
	set_dimensions: (width: number, height: number, opts?: SpringUpdateOpts) => void;
}

export const SPRING_OPTS_HARD = {hard: true};

// TODO these aren't exported by Svelte, maybe try a PR?
type SpringOpts = Exclude<Parameters<typeof spring>[1], undefined>;
type SpringUpdateOpts = Exclude<Parameters<ReturnType<typeof spring>['update']>[1], undefined>;

export const toCameraStore = (
	initial_state?: Partial<BaseCameraState>,
	springOpts?: SpringOpts,
): CameraStore => {
	const finalInitialState: BaseCameraState = {
		x: 0,
		y: 0,
		scale: 1,
		width: 0,
		height: 0,
		...initial_state,
	};

	// TODO make this more customizable? use a different store than a spring?
	const state = spring(finalInitialState, {
		stiffness: 0.006,
		damping: 0.12,
		...springOpts,
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
		setPosition: (x, y, opts) => state.update(($camera) => ({...$camera, x, y}), opts),
		set_dimensions: (width, height, opts = SPRING_OPTS_HARD) =>
			state.update(($camera) => ({...$camera, width, height}), opts),
	};

	return store;
};

const KEY = Symbol();
export const getCamera = (): CameraStore => getContext(KEY);
export const setCamera = (clock: CameraStore = toCameraStore()): CameraStore => (
	setContext(KEY, clock), clock
);
