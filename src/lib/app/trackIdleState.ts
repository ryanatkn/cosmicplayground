import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

interface TrackIdleStateOptions {
	idle: Writable<boolean>;
	timeToGoIdle: number;
	idleIntervalTime: number;
}

// TODO try to refactor this, `derived` maybe?

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const trackIdleState = (el: HTMLElement, opts: TrackIdleStateOptions) => {
	const {idle, idleIntervalTime} = opts;
	let {timeToGoIdle} = opts;

	let interval: any; // TODO type for browser only? should be `number`
	let idleTimer = 0;

	let $idle: boolean;
	const onChange = (_$idle: boolean) => {
		$idle = _$idle;
	};
	let unsubscribe = idle.subscribe(onChange);

	const updateIdleState = () => {
		if ($idle) return;
		idleTimer += idleIntervalTime;
		if (idleTimer >= timeToGoIdle) {
			idle.set(true);
		}
	};

	const startInterval = (idleIntervalTime: number) => {
		clearInterval(interval);
		interval = setInterval(updateIdleState, idleIntervalTime);
	};
	startInterval(idleIntervalTime);

	const resetIdleState = () => {
		idleTimer = 0;
		if ($idle) idle.set(false);
	};

	el.addEventListener('mousemove', resetIdleState, {capture: true});
	el.addEventListener('keydown', resetIdleState, {capture: true});

	return {
		update: ({idle, idleIntervalTime, timeToGoIdle: nextTimeToGoIdle}: TrackIdleStateOptions) => {
			timeToGoIdle = nextTimeToGoIdle;
			unsubscribe();
			unsubscribe = idle.subscribe(onChange);
			startInterval(idleIntervalTime);
		},
		destroy: () => {
			el.removeEventListener('mousemove', resetIdleState);
			el.removeEventListener('keydown', resetIdleState);
			unsubscribe();
			clearInterval(interval);
		},
	};
};

// TODO `idle.ts` module?
export const idleContextKey = {};
export const getIdle = (): Writable<boolean> => getContext(idleContextKey);
export const setIdle = (idle: Writable<boolean>): Writable<boolean> => {
	setContext(idleContextKey, idle);
	return idle;
};
