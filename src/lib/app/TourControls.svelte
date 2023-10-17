<script lang="ts">
	import {round} from '@grogarden/util/maths.js';
	import {get_clock} from '$lib/clock.js';

	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';
	import type Tour from '$lib/app/Tour.svelte';

	export let tour: Tour;
	export let debug_start_time: number;

	$: ({currentTime, currentStepIndex} = tour);

	const clock = get_clock();
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

<FloatingTextButton on:click={() => clock.toggle()}
	>{#if running}pause{:else}play{/if}</FloatingTextButton
>
<FloatingTextButton>time: {round($currentTime / 1000, 1).toFixed(1)}</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		const index = Number(prompt('index?', $currentStepIndex + '')); // eslint-disable-line no-alert
		if (!Number.isNaN(index)) {
			tour.seekIndexTo(index);
		}
	}}
>
	index: {$currentStepIndex}
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		tour.seekTimeTo(debug_start_time);
	}}
>
	seek to {Math.round(debug_start_time / 1000)}s
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		tour.seekTimeBy(1000);
	}}
>
	seek +1s
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		tour.seekTimeBy(-1000);
	}}
>
	seek -1s
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		tour.seekTimeBy(10000);
	}}
>
	seek +10s
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		tour.seekTimeBy(-10000);
	}}
>
	seek -10s
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		tour.seekTimeBy(100000);
	}}
>
	seek +100s
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		tour.seekTimeBy(-100000);
	}}
>
	seek -100s
</FloatingTextButton>
