<script lang="ts">
	import {onDestroy} from 'svelte';
	import {get_clock} from '$lib/flat/clock.js';
	import {get_dimensions} from '$lib/dimensions.js';

	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';
	import {get_settings} from '$lib/app/settings';
	import {unlockSatisfyingSecret} from '$lib/util/secret';

	const dimensions = get_dimensions();
	const settings = get_settings();

	let width = $dimensions.width;
	let height = $dimensions.height;
	$: width = $dimensions.width;
	$: height = $dimensions.height;

	const clock = get_clock();

	const hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60, 144];
	const WINNING_HZ_ITEMS = new Set([0, 143, 144, 287]);

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
<div class="view" on:click={toggle} aria-hidden>
	<div class="item" class:pulsing={$settings.secretEnabled}>
		<FreqSpectacle
			{width}
			height={height * 0.3}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
			bind:getHzItemSelectedIndices
		/>
	</div>
	<div class="item bottom" class:pulsing={$settings.secretEnabled}>
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
	<div class="item" class:pulsing={$settings.secretEnabled}>
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
	<div class="item" class:pulsing={$settings.secretEnabled}>
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
	.item:first-child,
	.item:last-child {
		--pulsing_duration: 0.5s;
	}
</style>
