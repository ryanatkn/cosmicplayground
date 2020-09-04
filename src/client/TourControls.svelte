<script>
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

<div class="clickable">time: {Math.round($tour.currentTime)}</div>
<div
	class="clickable"
	role="button"
	on:click|stopPropagation|preventDefault={() => {
		const index = Number(prompt('index?', $tour.currentStepIndex));
		if (!Number.isNaN(index)) {
			tour.seekIndexTo(index);
		}
	}}
>
	index: {$tour.currentStepIndex}
</div>
<div
	class="clickable"
	role="button"
	on:click|stopPropagation|preventDefault={() => {
		tour.seekTimeTo(debugStartTime);
	}}
>
	seek to {Math.round(debugStartTime / 1000)}s
</div>
<div
	class="clickable"
	role="button"
	on:click|stopPropagation|preventDefault={() => {
		tour.seekTimeBy(1000);
	}}
>
	seek +1s
</div>
<div
	class="clickable"
	role="button"
	on:click|stopPropagation|preventDefault={() => {
		tour.seekTimeBy(-1000);
	}}
>
	seek -1s
</div>
<div
	class="clickable"
	role="button"
	on:click|stopPropagation|preventDefault={() => {
		tour.seekTimeBy(10000);
	}}
>
	seek +10s
</div>
<div
	class="clickable"
	role="button"
	on:click|stopPropagation|preventDefault={() => {
		tour.seekTimeBy(-10000);
	}}
>
	seek -10s
</div>
<div
	class="clickable"
	role="button"
	on:click|stopPropagation|preventDefault={() => {
		tour.seekTimeBy(100000);
	}}
>
	seek +100s
</div>
<div
	class="clickable"
	role="button"
	on:click|stopPropagation|preventDefault={() => {
		tour.seekTimeBy(-100000);
	}}
>
	seek -100s
</div>
