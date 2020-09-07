<script>
	import ClockControls from './ClockControls.svelte';

	export let clock;
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
	:global(.idle) .clocks {
		cursor: none;
	}
	.controls {
		padding: 12px;
		border: 3px dashed rgba(0, 0, 0, 0.3);
		background: rgba(0, 0, 0, 0.15);
		display: flex;
	}
</style>
