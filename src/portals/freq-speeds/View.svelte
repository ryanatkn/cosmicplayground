<script>
	import FreqSpeeds from './FreqSpeeds.svelte';
	import {get_clock} from '../../app/clockStore.js';

	export const portal = undefined;
	export let width;
	export let height;

	const clock = get_clock();

	const hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
</script>

<div class="view" on:click={clock.toggle}>
	<FreqSpeeds
		{width}
		height={height / 2}
		elapsedTime={$clock.time}
		lowestHzItemCount={2}
		{hzItems}
	/>
	<FreqSpeeds
		{width}
		height={height / 2}
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
