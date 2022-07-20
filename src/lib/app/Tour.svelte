<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {createEventDispatcher, onDestroy} from 'svelte';
	import {swallow} from '@feltcoop/felt/util/dom.js';

	import {createResourcesStore, type AudioResource} from '$lib/app/resources';
	import {createTourStore, type TourHooks} from '$lib/app/tour';
	import {getSettings} from '$lib/app/settings';
	import {resetRenderStats, getRenderStats} from '$lib/app/renderStats';
	import type {ClockStore} from '$lib/app/clock';
	import type {TourData, TourStore, TourStep} from '$lib/app/tour';
	import type {Camera2} from '$lib/app/camera2';
	import TweenedCamera from '$lib/app/TweenedCamera.svelte';

	export let camera: Camera2;
	export let clock: ClockStore;
	export let hooks: Partial<TourHooks>;
	export let createTourData: () => TourData;

	// TODO BLOCK pause music with clock.
	// TODO BLOCK in devmode show a range input to manually seek

	// for external binding, not props
	export let tweenedCamera: TweenedCamera | undefined = undefined as any;
	// TODO BLOCK delete this store, move its logic here
	export const tour: Writable<TourStore | null> = writable(null);
	export const tourData: Writable<TourData | null> = writable(null);

	const settings = getSettings();
	$: devMode = $settings.devMode;
	$: audioEnabled = $settings.audioEnabled;

	const dispatchEvent = createEventDispatcher<{begin: undefined}>();

	const debugStartTime = 0; // ~0-300000

	const onKeyDown = (e: KeyboardEvent) => {
		if ($tour) {
			if (e.key === 'Escape' && !e.ctrlKey) {
				swallow(e);
				$tour.cancel();
			}
		}
	};

	const tourResources = createResourcesStore(); // creating this is lightweight enough to not be wasteful if the tour is never run
	const tourSongUrl = '/assets/audio/Alexander_Nakarada__Winter.mp3';
	// TODO maybe `addResource` should return a store per resource,
	// and then we can remove the next line `$: tourSong = ...`
	tourResources.addResource('audio', tourSongUrl);
	let tourSong: AudioResource;
	$: tourSong = $tourResources.resources.find((r) => r.url === tourSongUrl) as any; // TODO faster API, or maybe remove (see comment above)

	export const beginTour = (): void => {
		if ($tour) {
			$tour.cancel();
		}
		dispatchEvent('begin');
		if (!$tourData) {
			$tourData = createTourData();
		}
		const tourSongPlayStep = $tourData.steps.find((s) => 'name' in s && s.name === 'playSong'); // TODO or get from event handler?
		$tour = createTourStore($tourData, clock, {
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
					console.log(name, ($tour as any).currentTime);
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
				// TODO this hacky code could be replaced by adding abstractions to the tour
				// to manage things like audio and displaying specific content for a time window
				updateAudioOnSeek(tourSong.audio!, tourSongPlayStep!, currentTime);
				hooks.seek?.(currentTime, currentStepIndex);
			},
			done: (completed) => {
				$tour = null;
				tweenedCamera!.resetTweens();
				if (tourSong.audio && !tourSong.audio.paused) tourSong.audio.pause();
				if (devMode) console.log('render stats', getRenderStats());
				hooks.done?.(completed);
			},
		});
		if (devMode) {
			resetRenderStats();
			if (debugStartTime) setTimeout(() => $tour!.seekTimeTo(debugStartTime), 50);
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
		$tour?.cancel();
	});
</script>

<svelte:window on:keydown|capture={onKeyDown} />

<TweenedCamera {camera} bind:this={tweenedCamera} />
