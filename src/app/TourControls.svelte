<script>
	import FloatingTextButton from './FloatingTextButton.svelte';

	export let tour;
	export let debugStartTime;

	const TIME_SMALL_DELTA = 1000;
	const TIME_LARGE_DELTA = 10000;

	const onKeyDown = (e) => {
		switch (e.key) {
			case 'ArrowLeft': {
				tour.seekTimeBy(e.shiftKey ? -TIME_LARGE_DELTA : -TIME_SMALL_DELTA);
				break;
			}
			case 'ArrowRight': {
				tour.seekTimeBy(e.shiftKey ? TIME_LARGE_DELTA : TIME_SMALL_DELTA);
				break;
			}
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<FloatingTextButton>time: {Math.round($tour.currentTime)}</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		const index = Number(prompt('index?', $tour.currentStepIndex));
		if (!Number.isNaN(index)) {
			tour.seekIndexTo(index);
		}
	}}
>
	index: {$tour.currentStepIndex}
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
