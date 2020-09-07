<script>
	import FreqSpectacle from '../freq-spectacle/FreqSpectacle.svelte';

	// TODO what are the perf characteristics if we use the clock store directly?
	// will anything get updated unnecessarily every frame?

	export let time;
	export let running;
	export let pause;
	export let resume;
</script>

<div class="clock-controls" class:paused={!running}>
	{#if running}
		<img
			on:click={pause}
			src="assets/construction/person-rock.gif"
			alt="under construction: person rock"
			class="rock pixelated"
		/>
		<button type="button" class="w-50 h-20" on:click={pause}>
			<div style="font-size: 24px">⏸</div>
			pause universe clock
		</button>
	{:else}
		<img
			on:click={resume}
			src="assets/construction/person-rock-pause.png"
			alt="under construction: person rock pause"
			class="rock pixelated"
		/>
		<button type="button" class="w-50 h-20" on:click={resume}>
			<div style="font-size: 24px">▶</div>
			resume universe clock
		</button>
	{/if}
	<div on:click={() => (running ? pause() : resume())}>
		<FreqSpectacle
			elapsedTime={time}
			width={150}
			height={80}
			hzItems={[1, 3, 10]}
			lowestHzItemCount={2}
		/>
	</div>
</div>

<style>
	.clock-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
	.paused {
		filter: grayscale();
	}
	.rock {
		width: 120px;
		height: 80px;
	}
	.rock:hover {
		transform: scale3d(1.1, 1.1, 1);
	}
	.rock:active {
		transform: scale3d(1.2, 1.2, 1);
	}
</style>
