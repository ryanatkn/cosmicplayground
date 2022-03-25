<script lang="ts">
	import ColorClock from '$lib/portals/clocks/ColorClock.svelte';
	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';

	// TODO what are the perf characteristics if we use the clock store directly?
	// will anything get updated unnecessarily every frame?

	export let time: number;
	export let running: boolean;
	export let pause: () => void;
	export let resume: () => void;
</script>

<div class="clock-controls">
	{#if running}
		<button type="button" class="image-button" on:click={pause}>
			<img
				src="/assets/construction/person-rock.gif"
				alt="under construction: person rock"
				class="rock pixelated"
			/>
		</button>
	{:else}
		<img
			on:click={resume}
			src="/assets/construction/person-rock-pause.png"
			alt="under construction: person rock pause"
			class="rock pixelated"
		/>
	{/if}
	<FloatingTextButton style="height: auto;" on:click={running ? pause : resume}>
		<div class="py-12">
			<div style="font-size: 72px">{running ? '⏸' : '▶'}</div>
			{running ? 'pause universe clock' : 'resume universe clock'}
		</div>
	</FloatingTextButton>
	<ColorClock {time} on:click={() => (running ? pause() : resume())} />
</div>

<style>
	.clock-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.rock {
		width: 120px;
		height: 80px;
	}
</style>
