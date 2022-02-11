import {writable, get, type Writable} from 'svelte/store';
import {getContext, setContext} from 'svelte';
import {browser} from '$app/env';

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

export const toClockStore = (initial_state?: Partial<ClockState>): ClockStore => {
	const final_initial_state: ClockState = {
		running: false, // see below for where `initial_state.running` is used - the initializing `resume` call expects `running` to be false
		time: 0,
		dt: 0,
		...initial_state,
	};

	let lastTime: number | undefined;
	let reqId: number | undefined;

	const {subscribe, set, update} = writable(final_initial_state, () => {
		return () => {
			store.pause();
		};
	});

	const on_timer = (dt: number): void => {
		update(($clock) => ({...$clock, time: $clock.time + dt, dt}));
	};

	const on_frame = (t: number): void => {
		if (lastTime !== undefined) {
			on_timer(t - lastTime);
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

	if (!initial_state || initial_state.running) {
		store.resume();
	}

	return store;
};

export const KEY = Symbol();
export const get_clock = (): ClockStore => getContext(KEY);
export const setClock = (clock: ClockStore = toClockStore()): ClockStore => {
	setContext(KEY, clock);
	return clock;
};
