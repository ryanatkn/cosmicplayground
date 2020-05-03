<script>
	// TODO should we hoist some logic so this just takes a trial?
	export let level;

	$: currentIndex = $level.context.trial
		? $level.context.trial.presentingIndex === null
			? $level.context.trial.guessingIndex
			: $level.context.trial.presentingIndex
		: null;

	// TODO colors
	const getBgColor = ($level, index) => {
		return $level.state.value === 'complete'
			? 'rgba(255, 255, 255, 0.6)'
			: index === currentIndex
			? 'rgba(255, 255, 255, 0.4)'
			: index < currentIndex
			? 'rgba(255, 255, 255, 0.2)'
			: 'transparent';
	};
</script>

{#if $level.context.trial}
	<div class="flex h-full w-full">
		{#each {length: $level.context.trial.sequence.length} as _, index}
			<div
				class="flex-1 border-primary h-full"
				style="background-color: {getBgColor($level, index)}" />
		{/each}
	</div>
{/if}
