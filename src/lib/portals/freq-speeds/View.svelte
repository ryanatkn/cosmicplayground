<script lang="ts">
	import FreqSpeeds from './FreqSpeeds.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {getDimensions} from '$lib/app/dimensions';

	const dimensions = getDimensions();

	const clock = getClock();

	const hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
</script>

<div class="view" on:click={clock.toggle}>
	<FreqSpeeds
		width={$dimensions.width}
		height={$dimensions.height / 2}
		elapsedTime={$clock.time}
		lowestHzItemCount={2}
		{hzItems}
	/>
	<FreqSpeeds
		width={$dimensions.width}
		height={$dimensions.height / 2}
		style="transform: rotate(180deg);"
		elapsedTime={$clock.time}
		lowestHzItemCount={2}
		{hzItems}
	/>
</div>

<style>
	.view {
		display: flex;
		flex-direction: column;
	}
</style>
