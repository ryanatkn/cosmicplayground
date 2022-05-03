<script lang="ts">
	import FreqSpectacle from '$lib/portals/freq-spectacle/FreqSpectacle.svelte';

	// TODO consider setting a CSS var from 0 to 1 or 0 to 360, and calculate the hue+position smoothly, linearly

	// TODO what are the perf characteristics if we use the clock store directly?
	// will anything get updated unnecessarily every frame?

	export let time: number;
</script>

<div class="flex flex-col" on:click>
	{#each {length: 2} as _, i (i)}
		<div class="flex" class:mirror-y={i === 1}>
			<FreqSpectacle
				elapsedTime={time}
				width={150}
				height={80}
				hzItems={[1, 3]}
				lowestHzItemCount={2}
			/>
			<div class="flex mirror-x">
				<FreqSpectacle
					elapsedTime={time}
					width={150}
					height={80}
					hzItems={[1, 3]}
					lowestHzItemCount={2}
				/>
			</div>
		</div>
	{/each}
</div>
