<script lang="ts">
	import {getClock} from '$lib/app/clock';
	import ClockControls from '$lib/portals/clocks/ClockControls.svelte';

	const clock = getClock();
</script>

<div class="clocks">
	<div class="controls">
		<ClockControls
			time={$clock.time}
			running={$clock.running}
			pause={clock.pause}
			resume={clock.resume}
		/>
	</div>
</div>

<style>
	.clocks {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.controls {
		padding: var(--spacing-5);
		display: flex;
	}
</style>
