<script lang="ts">
	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';
	import type Tour from '$lib/app/Tour.svelte';

	export let tour: Tour;
	export let debugStartTime: number;

	$: ({currentTime, currentStepIndex} = tour);

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

<FloatingTextButton>time: {Math.round($currentTime)}</FloatingTextButton>
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
		tour.seekTimeTo(debugStartTime);
	}}
>
	seek to {Math.round(debugStartTime / 1000)}s
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
