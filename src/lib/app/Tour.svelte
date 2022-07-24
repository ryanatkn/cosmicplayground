<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {createEventDispatcher, onDestroy} from 'svelte';
	import {swallow} from '@feltcoop/felt/util/dom.js';
	import {UnreachableError} from '@feltcoop/felt/util/error.js';

	import {getSettings} from '$lib/app/settings';
	import {resetRenderStats, getRenderStats} from '$lib/app/renderStats';
	import type {ClockStore} from '$lib/app/clock';
	import type Camera from '$lib/app/Camera.svelte';
	import TweenedCamera from '$lib/app/TweenedCamera.svelte';
	import {
		findMostRecentStepOfType,
		type PanTourStep,
		type TourData,
		type TourHooks,
		type TourStep,
		type ZoomTourStep,
	} from '$lib/app/tour';

	export let camera: Camera;
	export let clock: ClockStore;
	export let hooks: Partial<TourHooks>;
	export let createTourData: () => TourData;

	// for external binding, not props
	export let paused = !$clock.running;
	export let tweenedCamera: TweenedCamera | undefined = undefined as any;
	export const touring = writable(false);
	export const currentTime = writable(0);
	export const currentStepIndex = writable(0);
	export const tourData: Writable<TourData | null> = writable(null);
	export const cancel = (): void => {
		finish(false);
	};
	export const seekTimeTo = (time: number): void => {
		seek(time);
	};
	export const seekTimeBy = (dt: number): void => {
		seek($currentTime + dt);
	};
	export const seekIndexTo = (index: number): void => {
		if (!$tourData) throw Error('expected tourData');
		seek($tourData.steps[clampIndex($tourData.steps, index)].startTime);
	};

	let finished = false;
	const finish = (completed: boolean): void => {
		if (finished) throw Error('Called finish twice');
		finished = true;
		baseHooks.done(completed);
	};

	$: ({running} = $clock);
	$: if (paused === running) {
		paused = !running;
	}
	$: if (running && $touring && $clock.dt > 0) {
		void handleClockTick($clock.dt);
	}

	// We walk through the steps one at a time,
	// tracking the amount of time that the current step has been active.
	// When that time is larger than the step's duration,
	// we apply that step and move to the next step
	// until we reach the end.
	let disableUpdate = false;
	const promises = new Map<string, Promise<void>>();
	const handleClockTick = async (dt: number): Promise<void> => {
		if (disableUpdate) return;
		if (!$tourData) throw Error('expected tourData');
		$currentTime += dt;
		// Apply each step that's ready.
		for (let i = $currentStepIndex; i < $tourData.steps.length; i++) {
			const step = $tourData.steps[i];
			if (step.startTime > $currentTime) {
				// The current step isn't ready yet, so we stop here for this tick.
				break;
			}
			// Apply this step.
			const duration = step.duration - ($currentTime - step.startTime);
			console.log('tour step and duration', duration, step);
			switch (step.type) {
				case 'pan': {
					baseHooks.pan(step.x, step.y, duration, step.easing);
					break;
				}
				case 'zoom': {
					baseHooks.zoom(step.scale, duration, step.easing);
					break;
				}
				case 'event': {
					const promiseOrVoid = baseHooks.event(step.name, step.data);
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
			if (i === $tourData.steps.length - 1) {
				finish(true);
			}
			// Advance to the next step.
			$currentStepIndex =
				$currentStepIndex === $tourData.steps.length - 1 ? -1 : $currentStepIndex + 1;
		}
	};

	const seek = (time: number): void => {
		if (!$tourData) throw Error('expected tourData');
		$currentTime = Math.min(Math.max(0, time), $tourData.totalDuration);
		$currentStepIndex = findNextStepIndexAtTime($tourData.steps, $currentTime);

		const mostRecentPanStep = findMostRecentStepOfType<PanTourStep>(
			$tourData.steps,
			'pan',
			$currentStepIndex - 1,
		);
		if (mostRecentPanStep) {
			baseHooks.pan(mostRecentPanStep.x, mostRecentPanStep.y, 0, mostRecentPanStep.easing);
		}
		const mostRecentZoomStep = findMostRecentStepOfType<ZoomTourStep>(
			$tourData.steps,
			'zoom',
			$currentStepIndex - 1,
		);
		if (mostRecentZoomStep) {
			baseHooks.zoom(mostRecentZoomStep.scale, 0, mostRecentZoomStep.easing);
		}

		// Apply the current step.
		void handleClockTick(0);
		if ($currentTime !== $tourData.totalDuration) {
			// This is a bit messy, but fixes a bug where seek is called after the tour ends.
			// Instead, should we just call the hook right before the tick?
			baseHooks.seek($currentTime, $currentStepIndex);
		}
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

	const baseHooks: TourHooks = {
		pan: (xTarget, yTarget, duration, easing) => {
			tweenedCamera!.pan(xTarget, yTarget, duration, easing);
			return hooks.pan?.(xTarget, yTarget, duration, easing);
		},
		zoom: (scaleTarget, duration, easing) => {
			tweenedCamera!.zoom(scaleTarget, duration, easing);
			return hooks.zoom?.(scaleTarget, duration, easing);
		},
		event: (name, data) => {
			if (name.startsWith('debug')) {
				console.log(name, $currentTime);
			}
			return hooks.event?.(name, data);
		},
		seek: (currentTime, currentStepIndex) => {
			return hooks.seek?.(currentTime, currentStepIndex);
		},
		done: (completed) => {
			$touring = false;
			tweenedCamera!.resetTweens();
			if (devMode) console.log('render stats', getRenderStats());
			return hooks.done?.(completed);
		},
	};

	const settings = getSettings();
	$: devMode = $settings.devMode;

	const dispatchEvent = createEventDispatcher<{begin: undefined}>();

	const debugStartTime = 0; // ~0-300000

	const onKeyDown = (e: KeyboardEvent) => {
		if ($touring) {
			if (e.key === 'Escape' && !e.ctrlKey) {
				swallow(e);
				cancel();
			}
		}
	};

	export const beginTour = (): void => {
		if ($touring) cancel();
		if (!$clock.running) clock.resume();
		$tourData = createTourData();
		$currentTime = 0;
		$currentStepIndex = 0;
		finished = false;
		$touring = true;
		dispatchEvent('begin');
		if (devMode) {
			resetRenderStats();
			if (debugStartTime) setTimeout(() => seekTimeTo(debugStartTime), 50);
		}
	};

	onDestroy(() => {
		if ($touring) cancel();
	});
</script>

<svelte:window on:keydown|capture={onKeyDown} />

<TweenedCamera {camera} enabled={!paused} bind:this={tweenedCamera} />
