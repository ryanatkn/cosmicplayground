<script lang="ts">
	import FreqSpectacle from './FreqSpectacle.svelte';
	import {get_clock} from '$lib/app/clockStore';

	export const portal = undefined;
	export let width: number;
	export let height: number;

	const clock = get_clock();

	const hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
</script>

<!-- TODO refactor this lol. also, do wackier thingg with it. -->
<div class="view" on:click={clock.toggle}>
	<FreqSpectacle
		{width}
		height={height * 0.7}
		elapsedTime={$clock.time}
		lowestHzItemCount={2}
		{hzItems}
	/>
	<div style="display: flex; justify-content: center;">
		<div style="flex: 0; display: flex; flex-direction: column;">
			<FreqSpectacle
				width={width * 0.25}
				height={height * 0.15}
				style="transform: rotate(180deg);"
				elapsedTime={$clock.time}
				lowestHzItemCount={2}
				{hzItems}
			/>
			<FreqSpectacle
				width={width * 0.25}
				height={height * 0.15}
				elapsedTime={$clock.time}
				lowestHzItemCount={2}
				{hzItems}
			/>
		</div>
		<FreqSpectacle
			width={width * 0.5}
			height={height * 0.3}
			style="transform: rotate(180deg);"
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
		/>
		<div style="flex: 0; display: flex; flex-direction: column;">
			<FreqSpectacle
				width={width * 0.25}
				height={height * 0.15}
				style="transform: rotate(180deg);"
				elapsedTime={$clock.time}
				lowestHzItemCount={2}
				{hzItems}
			/>
			<FreqSpectacle
				width={width * 0.25}
				height={height * 0.15}
				elapsedTime={$clock.time}
				lowestHzItemCount={2}
				{hzItems}
			/>
		</div>
	</div>
</div>

<style>
	.view {
		display: flex;
		flex-direction: column;
	}
</style>
