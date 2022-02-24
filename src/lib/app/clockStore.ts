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
	reset: () => void;
}

export const toClockStore = (initialState: Partial<ClockState> = {}): ClockStore => {
	let lastTime: number | undefined;
	let reqId: number | undefined;

	const {subscribe, set, update} = writable(
		{
			running: initialState.running ?? false,
			time: initialState.time ?? 0,
			dt: initialState.dt ?? 0,
		},
		() => {
			if (get(store).running) queueUpdate();
			return () => cancelUpdate();
		},
	);

	const onFrame = (t: number): void => {
		if (lastTime !== undefined) {
			const dt = t - lastTime;
			update(($clock) => ({running: $clock.running, time: $clock.time + dt, dt}));
		}
		lastTime = t;
		reqId = requestAnimationFrame(onFrame);
	};

	const queueUpdate = () => {
		if (reqId) cancelUpdate();
		lastTime = undefined;
		reqId = requestAnimationFrame(onFrame);
	};
	const cancelUpdate = () => {
		if (!reqId) return;
		cancelAnimationFrame(reqId);
		reqId = undefined;
	};

	const store: ClockStore = {
		subscribe,
		set,
		update,
		resume: (): void => {
			if (!browser) return;
			update(($clock) => {
				if ($clock.running) return $clock;
				queueUpdate();
				return {running: true, time: $clock.time, dt: $clock.dt};
			});
		},
		pause: (): void => {
			if (!browser) return;
			update(($clock) => {
				if (!$clock.running) return $clock;
				cancelUpdate();
				return {running: false, time: $clock.time, dt: $clock.dt};
			});
		},
		toggle: (): void => {
			if (get(store).running) {
				store.pause();
			} else {
				store.resume();
			}
		},
		reset: (): void => {
			update(($clock) => ({running: $clock.running, time: 0, dt: 0}));
		},
	};

	return store;
};

const KEY = Symbol();
export const getClock = (): ClockStore => getContext(KEY);
export const setClock = (clock: ClockStore = toClockStore()): ClockStore => (
	setContext(KEY, clock), clock
);
