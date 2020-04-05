<script>
	export let level;

	// TODO colors
	const getBgColor = ($level, index) => {
		return $level.status === 'complete'
			? 'rgba(255, 255, 255, 0.6)'
			: $level.trials[index] // trials are created when needed, not ahead of time
			? $level.trial && index === $level.trial.index
				? 'rgba(255, 255, 255, 0.4)'
				: 'rgba(255, 255, 255, 0.2)'
			: 'transparent';
	};
</script>

<div class="flex h-full w-full">
	{#each {length: $level.def.trialCount} as _, index}
		<div
			class="flex-1 border-primary h-full"
			style="background-color: {getBgColor($level, index)}" />
	{/each}
</div>
