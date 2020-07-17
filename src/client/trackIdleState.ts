import {Writable} from 'svelte/store';

interface TrackIdleStateOptions {
	isIdle: Writable<boolean>;
	timeToGoIdle: number;
	idleIntervalTime: number;
}

export const trackIdleState = (
	el: HTMLElement,
	{isIdle, timeToGoIdle, idleIntervalTime}: TrackIdleStateOptions,
) => {
	let interval: any; // TODO type for browser only? should be `number`
	let idleTimer = 0;

	let $isIdle: boolean;
	const onChange = (_$isIdle: boolean) => {
		$isIdle = _$isIdle;
	};
	let unsubscribe = isIdle.subscribe(onChange);

	const updateIdleState = () => {
		if ($isIdle) return;
		idleTimer += idleIntervalTime;
		if (idleTimer >= timeToGoIdle) {
			isIdle.set(true);
		}
	};

	const startInterval = (idleIntervalTime: number) => {
		clearInterval(interval);
		interval = setInterval(updateIdleState, idleIntervalTime);
	};
	startInterval(idleIntervalTime);

	const resetIdleState = () => {
		idleTimer = 0;
		if ($isIdle) isIdle.set(false);
	};

	el.addEventListener('mousemove', resetIdleState);
	el.addEventListener('keydown', resetIdleState);

	return {
		update: ({isIdle, idleIntervalTime, timeToGoIdle: _timeToGoIdle}: TrackIdleStateOptions) => {
			timeToGoIdle = _timeToGoIdle;
			unsubscribe();
			unsubscribe = isIdle.subscribe(onChange);
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
