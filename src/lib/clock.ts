import {writable, get, type Writable} from 'svelte/store';
import {getContext, setContext} from 'svelte';
import {browser} from '$app/environment';

// TODO merge with `clock`

export interface ClockState {
	running: boolean;
	time: number;
	dt: number;
}

export interface ClockStore extends Writable<ClockState> {
	resume: () => void;
	pause: () => void; // also semantically includes "stop", might want to make an explicit `stop`/`teardown`
	toggle: () => void;
	reset: () => void;
}

export const create_clock_store = (initial_state: Partial<ClockState> = {}): ClockStore => {
	let lastTime: number | undefined;
	let reqId: number | undefined;

	const {subscribe, set, update} = writable(
		{
			running: initial_state.running ?? false,
			time: initial_state.time ?? 0,
			dt: initial_state.dt ?? 0,
		},
		() => {
			if (get(store).running) queueUpdate();
			return () => cancelUpdate();
		},
	);

	const onFrame = (t: number): void => {
		// TODO cap `t` here? or on the
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
export const get_clock = (): ClockStore => getContext(KEY);
export const set_clock = (clock: ClockStore = create_clock_store()): ClockStore => (
	setContext(KEY, clock), clock
);
