<script lang="ts">
	import FreqSpectacle from '../freq-spectacle/FreqSpectacle.svelte';
	import FloatingTextButton from '../../app/FloatingTextButton.svelte';

	// TODO what are the perf characteristics if we use the clock store directly?
	// will anything get updated unnecessarily every frame?

	export let time;
	export let running;
	export let pause;
	export let resume;
</script>

<div class="clock-controls">
	{#if running}
		<img
			on:click={pause}
			src="/assets/construction/person-rock.gif"
			alt="under construction: person rock"
			class="rock pixelated"
		/>
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
	<div class="flex flex-col" on:click={() => (running ? pause() : resume())}>
		{#each {length: 2} as _, i (i)}
			<div class="flex" class:mirror-y={i === 1}>
				<FreqSpectacle
					elapsedTime={time}
					width={150}
					height={80}
					hzItems={[1, 3, 10]}
					lowestHzItemCount={2}
				/>
				<div class="flex mirror-x">
					<FreqSpectacle
						elapsedTime={time}
						width={150}
						height={80}
						hzItems={[1, 3, 10]}
						lowestHzItemCount={2}
					/>
				</div>
			</div>
		{/each}
	</div>
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
	.rock:hover {
		transform: scale3d(1.1, 1.1, 1);
	}
	.rock:active {
		transform: scale3d(1.2, 1.2, 1);
	}
</style>
