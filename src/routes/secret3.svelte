<script lang="ts">
	import {onDestroy} from 'svelte';

	import FreqSpectacle from '$lib/portals/freq-spectacle/FreqSpectacle.svelte';
	import {getClock} from '$lib/app/clock';
	import {getDimensions} from '$lib/app/dimensions';
	import {getSettings} from '$lib/app/settings';
	import {unlockSatisfyingSecret} from '$lib/util/secret';

	const dimensions = getDimensions();
	const settings = getSettings();

	let width = $dimensions.width;
	let height = $dimensions.height;
	$: width = $dimensions.width;
	$: height = $dimensions.height;

	const clock = getClock();

	const hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
	const WINNING_HZ_ITEMS = new Set([0, 59, 60, 119]);

	const toggle = () => {
		clock.toggle();
		if (!$clock.running) {
			const hzItemSelectedIndices = getHzItemSelectedIndices();
			const hzSelectedIndex = hzItemSelectedIndices.at(-1)!;
			if (WINNING_HZ_ITEMS.has(hzSelectedIndex)) {
				unlockSatisfyingSecret();
				if (!$settings.secretEnabled) {
					settings.update(($settings) => ({...$settings, secretEnabled: true}));
				}
			}
		} else {
			if ($settings.secretEnabled) {
				settings.update(($settings) => ({...$settings, secretEnabled: false}));
			}
		}
	};

	onDestroy(() => {
		// secret is ephemeral to just this view, so reset the status if needed
		if ($settings.secretEnabled) {
			settings.update(($settings) => ({...$settings, secretEnabled: false}));
		}
	});

	let getHzItemSelectedIndices: () => number[];
</script>

<!-- TODO refactor this lol. also, do wackier thingg with it. -->
<div class="view" on:click={toggle}>
	<div class="item">
		<FreqSpectacle
			{width}
			height={height * 0.3}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
			bind:getHzItemSelectedIndices
		/>
	</div>
	<div class="item bottom">
		<div class="item bottom-left">
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
			height={height * 0.35}
			style="transform: rotate(180deg);"
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
		/>
		<div class="item bottom-right">
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
	<div class="item">
		<FreqSpectacle
			width={width * 0.25}
			height={height * 0.1}
			style="transform: rotate(180deg);"
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
		/>
		<FreqSpectacle
			width={width * 0.25}
			height={height * 0.1}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
		/>
		<FreqSpectacle
			width={width * 0.25}
			height={height * 0.1}
			style="transform: rotate(180deg);"
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
		/>
		<FreqSpectacle
			width={width * 0.25}
			height={height * 0.1}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
		/>
	</div>
	<div class="item">
		<FreqSpectacle
			width={width * 0.25}
			height={height * 0.25}
			style="transform: rotate(180deg);"
			elapsedTime={$clock.time}
			lowestHzItemCount={4}
			{hzItems}
		/>
		<FreqSpectacle
			width={width * 0.25}
			height={height * 0.25}
			elapsedTime={$clock.time}
			lowestHzItemCount={4}
			{hzItems}
		/>
		<FreqSpectacle
			width={width * 0.25}
			height={height * 0.25}
			style="transform: rotate(180deg);"
			elapsedTime={$clock.time}
			lowestHzItemCount={4}
			{hzItems}
		/>
		<FreqSpectacle
			width={width * 0.25}
			height={height * 0.25}
			elapsedTime={$clock.time}
			lowestHzItemCount={4}
			{hzItems}
		/>
	</div>
</div>

<style>
	.view {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		opacity: 0.39;
	}
	:global(.secret) .view {
		opacity: 1;
	}
	.item {
		display: flex;
	}
	:global(.secret) .item {
		animation: pulsing 0.167s linear infinite alternate;
	}
	.bottom {
		display: flex;
		justify-content: center;
	}
	.bottom-left,
	.bottom-right {
		flex: 0;
		display: flex;
		flex-direction: column;
	}
</style>
