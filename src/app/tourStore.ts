import {writable, Writable, get} from 'svelte/store';
import {UnreachableError} from '@feltcoop/gro/dist/utils/error.js';

import {ClockStore} from './clock.js';

// TODO rotation!

export interface TourState {
	data: TourData;
	currentTime: number;
	currentStepIndex: number;
}

export interface TourStore {
	subscribe: Writable<TourState>['subscribe'];
	cancel: () => void;
	seekTimeTo: (time: number) => void;
	seekTimeBy: (dt: number) => void;
	seekIndexTo: (index: number) => void;
}

export interface TourData {
	totalDuration: number;
	steps: TourStep[];
}

export type TourStep = PanTourStep | ZoomTourStep | EventTourStep | WaitForEventTourStep;
export type TourStepType = TourStep['type'];
export interface TourStepBase {
	duration: number;
	startTime: number;
	index: number;
}
export interface PanTourStep extends TourStepBase {
	type: 'pan';
	easing: (t: number) => number;
	x: number;
	y: number;
}
export interface ZoomTourStep extends TourStepBase {
	type: 'zoom';
	easing: (t: number) => number;
	scale: number;
}
export interface EventTourStep extends TourStepBase {
	type: 'event';
	duration: 0;
	name: string;
	data: unknown;
}
export interface WaitForEventTourStep extends TourStepBase {
	type: 'waitForEvent';
	duration: 0;
	name: string;
}

export interface TourHooks {
	pan: (x: number, y: number, duration: number, easing: (t: number) => number) => void;
	zoom: (scale: number, duration: number, easing: (t: number) => number) => void;
	event: (name: string, data: unknown) => void | Promise<void>;
	seek: (currentTime: number, currentStepIndex: number) => void; // TODO should this be `onSeek` instead?
	done: (completed: boolean) => void;
}

// TODO maybe return a store instead of this API? hmm
export const createTourStore = (data: TourData, clock: ClockStore, hooks: TourHooks): TourStore => {
	console.log('createTourStore', data);
	const store = writable<TourState>({data, currentTime: 0, currentStepIndex: 0});
	const {subscribe, update} = store;

	// We walk through the steps one at a time,
	// tracking the amount of time that the current step has been active.
	// When that time is larger than the step's duration,
	// we apply that step and move to the next step
	// until we reach the end.
	let disableUpdate = false;
	const promises = new Map<string, Promise<void>>();
	const handleClockTick = async (dt: number): Promise<void> => {
		if (disableUpdate) return;
		let {
			currentTime,
			currentStepIndex,
			data: {steps},
		}: TourState = get(store); // TODO type?
		currentTime += dt;
		update((tourState) => ({...tourState, currentTime}));
		// console.log('update', currentTime, currentStepIndex);
		// Apply each step that's ready.
		for (let i = currentStepIndex; i < steps.length; i++) {
			const step = steps[i];
			if (step.startTime > currentTime) {
				// The current step isn't ready yet, so we stop here for this tick.
				break;
			}
			// Apply this step.
			const duration = step.duration - (currentTime - step.startTime);
			console.log('tour step and duration', duration, step);
			switch (step.type) {
				case 'pan': {
					hooks.pan(step.x, step.y, duration, step.easing);
					break;
				}
				case 'zoom': {
					hooks.zoom(step.scale, duration, step.easing);
					break;
				}
				case 'event': {
					const promiseOrVoid = hooks.event(step.name, step.data);
					if (promiseOrVoid) promises.set(step.name, promiseOrVoid);
					break;
				}
				case 'waitForEvent': {
					disableUpdate = true;
					const promise = promises.get(step.name);
					await promise;
					promises.delete(step.name);
					disableUpdate = false;
					break;
				}
				default: {
					throw new UnreachableError(step);
				}
			}
			// Did we just apply the final step?
			if (i === steps.length - 1) {
				finish(true);
			}
			// Advance to the next step.
			currentStepIndex = currentStepIndex === steps.length - 1 ? -1 : currentStepIndex + 1;
			update((tourState) => ({...tourState, currentStepIndex}));
		}
	};

	// TODO does this cause a memory leak? use derived?
	const unsubscribeClock = clock.subscribe(($clock) => {
		if ($clock.running && $clock.dt > 0) {
			handleClockTick($clock.dt);
		}
	});

	let finished = false;
	const finish = (completed: boolean): void => {
		if (finished) throw Error('Called finish twice');
		finished = true;
		unsubscribeClock();
		hooks.done(completed);
	};

	const seek = (time: number): void => {
		const {
			data: {totalDuration, steps},
		}: TourState = get(store); // TODO type?
		const currentTime = Math.min(Math.max(0, time), totalDuration);
		const currentStepIndex = findNextStepIndexAtTime(steps, currentTime);
		update((tourState) => ({...tourState, currentTime, currentStepIndex}));

		const mostRecentPanStep = findMostRecentStepOfType<PanTourStep>(
			steps,
			'pan',
			currentStepIndex - 1,
		);
		if (mostRecentPanStep) {
			hooks.pan(mostRecentPanStep.x, mostRecentPanStep.y, 0, mostRecentPanStep.easing);
		}
		const mostRecentZoomStep = findMostRecentStepOfType<ZoomTourStep>(
			steps,
			'zoom',
			currentStepIndex - 1,
		);
		if (mostRecentZoomStep) {
			hooks.zoom(mostRecentZoomStep.scale, 0, mostRecentZoomStep.easing);
		}

		// Apply the current step.
		handleClockTick(0);
		if (currentTime !== totalDuration) {
			// This is a bit messy, but fixes a bug where seek is called after the tour ends.
			// Instead, should we just call the hook right before the tick?
			hooks.seek(currentTime, currentStepIndex);
		}
	};

	return {
		subscribe,
		cancel: (): void => {
			finish(false);
		},
		seekTimeTo: (time: number): void => {
			seek(time);
		},
		seekTimeBy: (dt: number): void => {
			seek(get(store).currentTime + dt);
		},
		seekIndexTo: (index: number): void => {
			const {
				data: {steps},
			}: TourState = get(store); // TODO type?
			seek(steps[clampIndex(steps, index)].startTime);
		},
	};
};

const clampIndex = (steps: TourStep[], index: number): number =>
	Math.max(0, Math.min(Math.round(index), steps.length - 1));

const findNextStepIndexAtTime = (steps: TourStep[], time: number): number => {
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		// TODO this is messy and either is broken or suggests other things might be broken -
		// the point is that we want to ignore event-related steps.
		if (step.startTime + step.duration >= time && (step.type === 'pan' || step.type === 'zoom')) {
			return i;
		}
	}
	return -1;
};

export const findMostRecentStepOfType = <T extends TourStep>(
	steps: TourStep[],
	type: T['type'],
	startIndex: number = steps.length - 1,
): T | undefined => {
	for (let i = startIndex; i >= 0; i--) {
		const step = steps[i];
		if (step.type === type) return step as T;
	}
	return undefined;
};
