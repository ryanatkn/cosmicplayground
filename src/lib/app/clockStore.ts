import {writable, get, type Writable} from 'svelte/store';
import {getContext, setContext} from 'svelte';
import {browser} from '$app/env';

// TODO merge with `clockStore`

export interface ClockState {
	running: boolean;
	time: number;
	dt: number;
}

export interface ClockStore {
	subscribe: Writable<ClockState>['subscribe'];
	set: Writable<ClockState>['set'];
	update: Writable<ClockState>['update'];
	resume: () => void;
	pause: () => void; // also semantically includes "stop", might want to make an explicit `stop`/`teardown`
	toggle: () => void;
}

export const toClockStore = (initialState?: Partial<ClockState>): ClockStore => {
	const finalInitialState: ClockState = {
		running: false, // see below for where `initialState.running` is used - the initializing `resume` call expects `running` to be false
		time: 0,
		dt: 0,
		...initialState,
	};

	let lastTime: number | undefined;
	let reqId: number | undefined;

	const {subscribe, set, update} = writable(finalInitialState, () => {
		return () => {
			store.pause();
		};
	});

	const onTimer = (dt: number): void => {
		update(($clock) => ({...$clock, time: $clock.time + dt, dt}));
	};

	const on_frame = (t: number): void => {
		if (lastTime !== undefined) {
			onTimer(t - lastTime);
		}
		lastTime = t;
		reqId = requestAnimationFrame(on_frame);
	};

	const store: ClockStore = {
		subscribe,
		set,
		update,
		resume: (): void => {
			if (!browser) return;
			update(($clock) => {
				if ($clock.running) return $clock;
				lastTime = undefined;
				reqId = requestAnimationFrame(on_frame);
				return {...$clock, running: true};
			});
		},
		pause: (): void => {
			if (!browser) return;
			update(($clock) => {
				if (!$clock.running) return $clock;
				if (reqId) cancelAnimationFrame(reqId);
				return {...$clock, running: false};
			});
		},
		toggle: (): void => {
			if (get(store).running) {
				store.pause();
			} else {
				store.resume();
			}
		},
	};

	if (!initialState || initialState.running) {
		store.resume();
	}

	return store;
};

const KEY = Symbol();
export const getClock = (): ClockStore => getContext(KEY);
export const setClock = (clock: ClockStore = toClockStore()): ClockStore => (
	setContext(KEY, clock), clock
);
