import {sineInOut} from 'svelte/easing';

import {
	findMostRecentStepOfType,
	type TourData,
	type TourStep,
	type TourStepType,
	type PanTourStep,
	type ZoomTourStep,
} from '$lib/app/tour';

type Easing = (t: number) => number;

export interface TourBuilder {
	wait: (time?: number) => void;
	pan: (x: number, y: number, duration: number, easing?: Easing) => void;
	zoom: (scale: number, duration: number, easing?: Easing) => void;
	panBy: (x: number, y: number, duration: number, easing?: Easing) => void;
	zoomBy: (scale: number, duration: number, easing?: Easing) => void;
	event: (name: string, data?: unknown) => () => void;
	finalize: () => TourData;
}

// TODO refactor into a class?
export const createTourBuilder = (): TourBuilder => {
	let currentTime = 0;
	let currentMaxTime = 0;

	const steps: TourStep[] = [];
	const finalize = (): TourData => {
		return {steps, totalDuration: currentMaxTime};
	};

	const lastStepsByType = new Map<TourStepType, TourStep>();
	const addStep = (rawStep: TourStep): void => {
		// The `rawStep` doesn't need a valid `index`,
		// and its `startTime` is added to the final step's `startTime`,
		// so it's generally 0 unless it's making a multi-step tween.
		// Not sure how to do this cleanly with the type system -
		// I tried with `PartialExcept` but it doesn't play nicely with unions.
		const step: TourStep = {
			...rawStep,
			startTime: currentTime + rawStep.startTime,
			index: steps.length,
		};
		const lastOfSameType = lastStepsByType.get(step.type);
		if (lastOfSameType && lastOfSameType.startTime + lastOfSameType.duration > step.startTime) {
			console.error('Conflicting step', step);
			throw Error(
				`Cannot add conflicting step with type ${step.type} with currentTime ${currentTime} at trnasform ${steps.length}`,
			);
		}
		steps.push(step);
		lastStepsByType.set(step.type, step);
		currentMaxTime = Math.max(currentMaxTime, step.startTime + step.duration);
	};

	const wait = (time?: number): void => {
		if (time === undefined) {
			currentTime = currentMaxTime;
		} else {
			currentTime += time;
		}
	};
	const pan = (x: number, y: number, duration: number, easing: Easing = sineInOut): void => {
		addStep({type: 'pan', startTime: 0, index: -1, x, y, duration, easing});
	};
	const zoom = (scale: number, duration: number, easing: Easing = sineInOut): void => {
		addStep({type: 'zoom', startTime: 0, index: -1, scale, duration, easing});
	};
	const panBy = (
		xDelta: number,
		yDelta: number,
		duration: number,
		easing: Easing = sineInOut,
	): void => {
		const previousPanStep = findMostRecentStepOfType<PanTourStep>(steps, 'pan');
		if (!previousPanStep) throw Error(`Cannot call 'panBy' before at least one 'pan' step.`);
		pan(previousPanStep.x + xDelta, previousPanStep.y + yDelta, duration, easing);
	};
	const zoomBy = (scaleDelta: number, duration: number, easing: Easing = sineInOut): void => {
		const previousZoomStep = findMostRecentStepOfType<ZoomTourStep>(steps, 'zoom');
		if (!previousZoomStep) throw Error(`Cannot call 'zoomBy' before at least one 'zoom' step.`);
		zoom(previousZoomStep.scale * scaleDelta, duration, easing);
	};
	const waitedForEventId = new Set();
	let eventCounter = 0;
	const event = (name: string, data?: unknown) => {
		addStep({type: 'event', startTime: 0, index: -1, duration: 0, name, data});
		const eventId = ++eventCounter;
		// TODO for synchronous events this goes unused, maybe we should have a different API?
		return () => {
			if (waitedForEventId.has(eventId)) {
				throw Error(`Already waited for event '${name}' with id ${eventId}`);
			}
			addStep({type: 'waitForEvent', startTime: 0, index: -1, duration: 0, name});
			waitedForEventId.add(eventId);
		};
	};

	return {wait, pan, zoom, panBy, zoomBy, event, finalize};
};
