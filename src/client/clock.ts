import {writable, get, Writable} from 'svelte/store';

// I tried to avoid using `get`, but there's one place where it's used.
// Subscribing to the `running` value seems to add a lot of complexity
// to get it working correctly.
// If the store is subscribed to in the function that creates it,
// it'll never reach 0 subscribers and be cleaned up,
// creating a memory leak. There are probably better ways to do this.

export interface ClockState {
	time: number;
	running: boolean;
	dt: number;
}

export interface ClockStore {
	subscribe: Writable<ClockState>['subscribe'];
	set: Writable<ClockState>['set'];
	update: Writable<ClockState>['update'];
	resume: () => void;
	pause: () => void;
	toggle: () => void;
}

export const createClock = (initialState: {time?: number; running?: boolean} = {}): ClockStore => {
	let lastTime: number | undefined;
	let reqId: number | undefined;

	const clock = writable(
		{
			time: initialState.time || 0,
			running: false, // see below for where `initialState.running` is used - the initializing `resume` call expects `running` to be false
			dt: 0,
		},
		() => {
			return () => {
				pause();
			};
		},
	);
	const {subscribe, set, update} = clock;

	const onTimer = (dt: number): void => {
		update((c) => ({...c, time: c.time + dt, dt}));
	};

	const onFrame = (t: number): void => {
		if (lastTime !== undefined) {
			onTimer(t - lastTime);
		}
		lastTime = t;
		reqId = requestAnimationFrame(onFrame);
	};

	const resume = (): void => {
		update((c) => {
			if (c.running) return c;
			lastTime = undefined;
			reqId = requestAnimationFrame(onFrame);
			return {...c, running: true};
		});
	};
	const pause = (): void => {
		update((c) => {
			if (!c.running) return c;
			if (reqId) cancelAnimationFrame(reqId);
			return {...c, running: false};
		});
	};
	const toggle = (): void => {
		get(clock).running ? pause() : resume();
	};

	if (initialState.running !== false) {
		resume();
	}

	return {subscribe, set, update, resume, pause, toggle};
};
