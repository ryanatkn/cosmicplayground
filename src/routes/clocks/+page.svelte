<script lang="ts">
	import {onDestroy} from 'svelte';
	import {get_clock} from '$lib/dealt/clock.js';
	import {get_dimensions} from '$lib/dealt';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';
	import {setInStorage} from '$lib/util/storage';
	import {STORAGE_KEY_STRENGTH_BOOSTER1} from '$routes/data';
	import {get_settings} from '$lib/app/settings';
	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';

	// TODO give user control over speed in dialog

	const dimensions = get_dimensions();
	const clock = get_clock();
	const settings = get_settings();

	const hzItems = [9, 15, 24];
	const WINNING_HZ_ITEMS = new Set([0]);

	const toggle = () => {
		clock.toggle();
		if (!$clock.running) {
			const hzSelectedIndex = getHzItemSelectedIndices().at(-1)!;
			const hzSelectedIndex2 = getHzItemSelectedIndices2().at(-1)!;
			if (WINNING_HZ_ITEMS.has(hzSelectedIndex) && WINNING_HZ_ITEMS.has(hzSelectedIndex2)) {
				setInStorage(STORAGE_KEY_STRENGTH_BOOSTER1, true);
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
	let getHzItemSelectedIndices2: () => number[];
</script>

<div class="view" on:click={toggle} aria-hidden>
	<div class="item" class:pulsing={$settings.secretEnabled}>
		<FreqSpeeds
			width={$dimensions.width / 2}
			height={$dimensions.height / 2}
			style="transform: scale3d(-1, 1, 1);"
			elapsedTime={$clock.time / 4}
			lowestHzItemCount={1}
			{hzItems}
			bind:getHzItemSelectedIndices
		/>
		<FreqSpeeds
			width={$dimensions.width / 2}
			height={$dimensions.height / 2}
			style="transform: scale3d(-1, -1, 1);"
			elapsedTime={$clock.time / 4}
			lowestHzItemCount={1}
			{hzItems}
		/>
	</div>
	<div class="item" class:pulsing={$settings.secretEnabled}>
		<FreqSpectacle
			width={$dimensions.width * 0.5}
			height={$dimensions.height / 2}
			elapsedTime={$clock.time / 8}
			lowestHzItemCount={1}
			{hzItems}
			bind:getHzItemSelectedIndices={getHzItemSelectedIndices2}
		/>
		<FreqSpectacle
			width={$dimensions.width * 0.5}
			height={$dimensions.height / 2}
			style="transform: scale3d(1, -1, 1);"
			elapsedTime={$clock.time / 8}
			lowestHzItemCount={1}
			{hzItems}
		/>
	</div>
</div>

<style>
	.view {
		display: flex;
		flex: 1;
		overflow: hidden;
		position: relative;
	}
	.item {
		display: flex;
		flex-direction: column;
	}
	.item:first-child {
		--pulsing_duration: 0.5s;
	}
</style>
