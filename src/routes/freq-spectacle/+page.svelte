<script lang="ts">
	import {onDestroy} from 'svelte';
	import {clock_context} from '$lib/clock.js';
	import {dimensions_context} from '$lib/dimensions.js';

	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';
	import {get_settings} from '$lib/settings.js';
	import {STORAGE_KEY_STRENGTH_BOOSTER3} from '$routes/data.js';
	import {setInStorage} from '$lib/storage.js';

	const dimensions = dimensions_context.get();
	const settings = get_settings();

	let width = $dimensions.width;
	let height = $dimensions.height;
	$: width = $dimensions.width;
	$: height = $dimensions.height;

	const clock = clock_context.get();

	const hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
	const WINNING_HZ_ITEMS = new Set([0, 119, 59, 60]);

	const toggle = () => {
		clock.toggle();
		if (!$clock.running) {
			const hzItemSelectedIndices = getHzItemSelectedIndices();
			const hzSelectedIndex = hzItemSelectedIndices.at(-1)!;
			if (WINNING_HZ_ITEMS.has(hzSelectedIndex)) {
				setInStorage(STORAGE_KEY_STRENGTH_BOOSTER3, true);
				if (!$settings.secret_enabled) {
					settings.update(($settings) => ({...$settings, secret_enabled: true}));
				}
			}
		} else {
			if ($settings.secret_enabled) {
				settings.update(($settings) => ({...$settings, secret_enabled: false}));
			}
		}
	};

	onDestroy(() => {
		// secret is ephemeral to just this view, so reset the status if needed
		if ($settings.secret_enabled) {
			settings.update(($settings) => ({...$settings, secret_enabled: false}));
		}
	});

	let getHzItemSelectedIndices: () => number[];
</script>

<!-- TODO refactor this lol. also, do wackier thingg with it. -->
<div class="view" onclick={toggle} aria-hidden="true">
	<div class="item" class:pulsing={$settings.secret_enabled}>
		<FreqSpectacle
			{width}
			height={height * 0.7}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
			bind:getHzItemSelectedIndices
		/>
	</div>
	<div class="item bottom" class:pulsing={$settings.secret_enabled}>
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
			height={height * 0.3}
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
	.item:first-child {
		--pulsing_duration: 0.5s;
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
