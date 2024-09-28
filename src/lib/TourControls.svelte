<script lang="ts">
	import {round} from '@ryanatkn/belt/maths.js';
	import {clock_context} from '$lib/clock.js';

	import FloatingTextButton from '$lib/FloatingTextButton.svelte';
	import type Tour from '$lib/Tour.svelte';

	export let tour: Tour;
	export let debug_start_time: number;

	$: ({currentTime, currentStepIndex} = tour);

	const clock = clock_context.get();
	$: ({running} = $clock);

	const TIME_DELTA_SM = 1000;
	const TIME_DELTA_MD = 10000;
	const TIME_DELTA_LG = 100000;

	const onKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowLeft': {
				tour.seekTimeBy(
					e.shiftKey ? (e.ctrlKey ? -TIME_DELTA_LG : -TIME_DELTA_MD) : -TIME_DELTA_SM,
				);
				break;
			}
			case 'ArrowRight': {
				tour.seekTimeBy(e.shiftKey ? (e.ctrlKey ? TIME_DELTA_LG : TIME_DELTA_MD) : TIME_DELTA_SM);
				break;
			}
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<FloatingTextButton onclick={() => clock.toggle()}
	>{#if running}pause{:else}play{/if}</FloatingTextButton
>
<FloatingTextButton>time: {round($currentTime / 1000, 1).toFixed(1)}</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		const index = Number(prompt('index?', $currentStepIndex + '')); // eslint-disable-line no-alert
		if (!Number.isNaN(index)) {
			tour.seekIndexTo(index);
		}
	}}
>
	index: {$currentStepIndex}
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		tour.seekTimeTo(debug_start_time);
	}}
>
	seek to {Math.round(debug_start_time / 1000)}s
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		tour.seekTimeBy(1000);
	}}
>
	seek +1s
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		tour.seekTimeBy(-1000);
	}}
>
	seek -1s
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		tour.seekTimeBy(10000);
	}}
>
	seek +10s
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		tour.seekTimeBy(-10000);
	}}
>
	seek -10s
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		tour.seekTimeBy(100000);
	}}
>
	seek +100s
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		tour.seekTimeBy(-100000);
	}}
>
	seek -100s
</FloatingTextButton>
