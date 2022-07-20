import {writable, type Readable} from 'svelte/store';
import {UnreachableError} from '@feltcoop/felt/util/error.js';

import type {ClockStore} from '$lib/app/clock.js';

// TODO rotation!

export interface TourState {
	// TODO BLOCK maybe make each of these a store, and `data` not reactive (at least for now, it could be...)
	// This would get us more granular changes if all you care about is the step changing.
	currentTime: number;
	currentStepIndex: number;
}

export interface TourStore extends Readable<TourState> {
	data: TourData;
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

export const createTourStore = (data: TourData, clock: ClockStore, hooks: TourHooks): TourStore => {
	console.log('createTourStore', data);

	let $state: TourState = {currentTime: 0, currentStepIndex: 0};
	const {subscribe, update} = writable<TourState>($state);
	const unsubscribeState = subscribe(($v) => {
		$state = $v;
	});

	// We walk through the steps one at a time,
	// tracking the amount of time that the current step has been active.
	// When that time is larger than the step's duration,
	// we apply that step and move to the next step
	// until we reach the end.
	let disableUpdate = false;
	const promises = new Map<string, Promise<void>>();
	const handleClockTick = async (dt: number): Promise<void> => {
		if (disableUpdate) return;
		const {currentStepIndex} = $state;
		const currentTime = $state.currentTime + dt;
		update(($v) => ({...$v, currentTime}));
		// Apply each step that's ready.
		for (let i = currentStepIndex; i < data.steps.length; i++) {
			const step = data.steps[i];
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
					const promiseOrVoid = promises.get(step.name);
					await promiseOrVoid; // eslint-disable-line no-await-in-loop
					promises.delete(step.name);
					disableUpdate = false;
					break;
				}
				default: {
					throw new UnreachableError(step);
				}
			}
			// Did we just apply the final step?
			if (i === data.steps.length - 1) {
				finish(true);
			}
			// Advance to the next step.
			update(($v) => ({
				...$v,
				currentStepIndex: currentStepIndex === data.steps.length - 1 ? -1 : currentStepIndex + 1,
			}));
		}
	};

	const unsubscribeClock = clock.subscribe(($clock) => {
		if ($clock.running && $clock.dt > 0) {
			void handleClockTick($clock.dt);
		}
	});

	let finished = false;
	const finish = (completed: boolean): void => {
		if (finished) throw Error('Called finish twice');
		finished = true;
		// TODO BLOCK requires that `finish` be called, which is error prone, should use store stop instead?
		// We currently use the `onDestroy` hooks to ensure it gets canceled.
		unsubscribeState();
		unsubscribeClock();
		hooks.done(completed);
	};

	const seek = (time: number): void => {
		const currentTime = Math.min(Math.max(0, time), data.totalDuration);
		const currentStepIndex = findNextStepIndexAtTime(data.steps, currentTime);
		update(($v) => ({...$v, currentTime, currentStepIndex}));

		const mostRecentPanStep = findMostRecentStepOfType<PanTourStep>(
			data.steps,
			'pan',
			currentStepIndex - 1,
		);
		if (mostRecentPanStep) {
			hooks.pan(mostRecentPanStep.x, mostRecentPanStep.y, 0, mostRecentPanStep.easing);
		}
		const mostRecentZoomStep = findMostRecentStepOfType<ZoomTourStep>(
			data.steps,
			'zoom',
			currentStepIndex - 1,
		);
		if (mostRecentZoomStep) {
			hooks.zoom(mostRecentZoomStep.scale, 0, mostRecentZoomStep.easing);
		}

		// Apply the current step.
		void handleClockTick(0);
		if (currentTime !== data.totalDuration) {
			// This is a bit messy, but fixes a bug where seek is called after the tour ends.
			// Instead, should we just call the hook right before the tick?
			hooks.seek(currentTime, currentStepIndex);
		}
	};

	return {
		subscribe,
		data,
		cancel: (): void => {
			finish(false);
		},
		seekTimeTo: (time: number): void => {
			seek(time);
		},
		seekTimeBy: (dt: number): void => {
			seek($state.currentTime + dt);
		},
		seekIndexTo: (index: number): void => {
			seek(data.steps[clampIndex(data.steps, index)].startTime);
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
