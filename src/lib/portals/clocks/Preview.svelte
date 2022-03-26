<script lang="ts">
	import ColorClock from '$lib/portals/clocks/ColorClock.svelte';
	import {getClock} from '$lib/app/clockStore';

	const clock = getClock();
</script>

<div class="preview">
	<ColorClock time={$clock.time} />
	<h2>clocks</h2>
</div>

<style>
	.preview {
		padding: var(--portal_padding);
	}
	h2 {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
