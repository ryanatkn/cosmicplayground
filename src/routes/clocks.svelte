<script lang="ts">
	import {getClock} from '$lib/app/clock';
	import ColorClock from '$lib/portals/clocks/ColorClock.svelte';

	const clock = getClock();
</script>

<div class="clocks">
	<ColorClock
		time={$clock.time}
		on:click={() => ($clock.running ? clock.pause() : clock.resume())}
	/>
</div>

<style>
	.clocks {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}
</style>
