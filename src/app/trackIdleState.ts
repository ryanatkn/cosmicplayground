import {Writable} from 'svelte/store';

interface TrackIdleStateOptions {
	idle: Writable<boolean>;
	timeToGoIdle: number;
	idleIntervalTime: number;
}

export const trackIdleState = (
	el: HTMLElement,
	{idle, timeToGoIdle, idleIntervalTime}: TrackIdleStateOptions,
) => {
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

	el.addEventListener('mousemove', resetIdleState);
	el.addEventListener('keydown', resetIdleState);

	return {
		update: ({idle, idleIntervalTime, timeToGoIdle: _timeToGoIdle}: TrackIdleStateOptions) => {
			timeToGoIdle = _timeToGoIdle;
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
