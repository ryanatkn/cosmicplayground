<script context="module" lang="ts">
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
</script>

<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {createEventDispatcher, onDestroy} from 'svelte';
	import {swallow} from '@feltcoop/felt/util/dom.js';
	import {UnreachableError} from '@feltcoop/felt/util/error.js';

	import {createResourcesStore, type AudioResource} from '$lib/app/resources';
	import {getSettings} from '$lib/app/settings';
	import {resetRenderStats, getRenderStats} from '$lib/app/renderStats';
	import type {ClockStore} from '$lib/app/clock';
	import type Camera from '$lib/app/Camera.svelte';
	import TweenedCamera from '$lib/app/TweenedCamera.svelte';

	export let camera: Camera;
	export let clock: ClockStore;
	export let hooks: Partial<TourHooks>;
	export let createTourData: () => TourData;

	// TODO BLOCK pause music with clock.
	// TODO BLOCK in devmode show a range input to manually seek

	// for external binding, not props
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
		if (!$tourData) throw Error(); // TODO BLOCK remove this?
		seek($tourData.steps[clampIndex($tourData.steps, index)].startTime);
	};

	let finished = false;
	const finish = (completed: boolean): void => {
		if (finished) throw Error('Called finish twice');
		finished = true;
		// TODO BLOCK requires that `finish` be called, which is error prone, should use store stop instead?
		// We currently use the `onDestroy` hooks to ensure it gets canceled.
		baseHooks.done(completed);
	};

	$: if ($clock.running && $clock.dt > 0) {
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
		if (!$tourData) throw Error(); // TODO BLOCK remove this?
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
		if (!$tourData) throw Error(); // TODO BLOCK remove this?
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

	$: tourSongPlayStep = $tourData?.steps.find((s) => 'name' in s && s.name === 'playSong'); // TODO or get from event handler?

	const baseHooks: TourHooks = {
		pan: (xTarget, yTarget, duration, easing) => {
			tweenedCamera!.updatePanTweens(xTarget, yTarget, duration, easing);
			hooks.pan?.(xTarget, yTarget, duration, easing);
		},
		zoom: (scaleTarget, duration, easing) => {
			tweenedCamera!.updateScaleTween(scaleTarget, duration, easing);
			hooks.zoom?.(scaleTarget, duration, easing);
		},
		event: (name, data) => {
			if (name.startsWith('debug')) {
				console.log(name, $currentTime);
				return hooks.event?.(name, data);
			}
			switch (name) {
				case 'load': {
					return tourResources.load().then(() => hooks.event?.(name, data)); // is idempotent
				}
				case 'playSong': {
					tourSong.audio!.currentTime = 0;
					if (audioEnabled) void tourSong.audio!.play();
					break;
				}
			}
			return hooks.event?.(name, data);
		},
		seek: (currentTime, currentStepIndex) => {
			if (!tourSong.audio) throw Error('seek expects expected tourSong.audio');
			if (!tourSongPlayStep) throw Error('seek expects tourSongPlayStep');
			// TODO this hacky code could be replaced by adding abstractions to the tour
			// to manage things like audio and displaying specific content for a time window
			updateAudioOnSeek(tourSong.audio, tourSongPlayStep, currentTime);
			hooks.seek?.(currentTime, currentStepIndex);
		},
		done: (completed) => {
			$touring = false;
			tweenedCamera!.resetTweens();
			if (tourSong.audio && !tourSong.audio.paused) tourSong.audio.pause();
			if (devMode) console.log('render stats', getRenderStats());
			hooks.done?.(completed);
		},
	};

	const settings = getSettings();
	$: devMode = $settings.devMode;
	$: audioEnabled = $settings.audioEnabled;

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

	const tourResources = createResourcesStore(); // creating this is lightweight enough to not be wasteful if the tour is never run
	// TODO BLOCK extract - prop? part of tour data instead? or do this in the `DeepBreathTour`?
	const tourSongUrl = '/assets/audio/Alexander_Nakarada__Winter.mp3';
	// TODO maybe `addResource` should return a store per resource,
	// and then we can remove the next line `$: tourSong = ...`
	tourResources.addResource('audio', tourSongUrl);
	let tourSong: AudioResource;
	$: tourSong = $tourResources.resources.find((r) => r.url === tourSongUrl) as any; // TODO faster API, or maybe remove (see comment above)

	export const beginTour = (): void => {
		if ($touring) cancel();
		dispatchEvent('begin');
		if (!$tourData) {
			$tourData = createTourData();
		}
		$touring = true;
		if (devMode) {
			resetRenderStats();
			if (debugStartTime) setTimeout(() => seekTimeTo(debugStartTime), 50);
		}
	};

	export const updateAudioOnSeek = (
		audio: HTMLAudioElement,
		step: TourStep,
		currentTime: number,
	): void => {
		const stepCurrentTime = currentTime - step.startTime;
		const audioDuration = audio.duration * 1000;
		if (stepCurrentTime >= 0 && stepCurrentTime < audioDuration) {
			audio.currentTime = stepCurrentTime / 1000;
			if (audio.paused && audioEnabled) {
				void audio.play();
			}
		} else if (!audio.paused) {
			audio.pause();
		}
	};

	onDestroy(() => {
		if ($touring) cancel();
	});
</script>

<svelte:window on:keydown|capture={onKeyDown} />

<TweenedCamera {camera} bind:this={tweenedCamera} />
