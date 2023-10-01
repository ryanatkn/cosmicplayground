<script lang="ts">
	import {onDestroy} from 'svelte';
	import {get_clock} from '$lib/flat/clock.js';
	import {get_dimensions} from '$lib/dimensions.js';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';
	import {setInStorage} from '$lib/util/storage';
	import {STORAGE_KEY_STRENGTH_BOOSTER2} from '$routes/data';
	import {get_settings} from '$lib/app/settings';

	// TODO give user control over speed in dialog

	const dimensions = get_dimensions();
	const clock = get_clock();
	const settings = get_settings();

	const hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
	const WINNING_HZ_ITEMS = new Set([0, 119, 59, 60]);

	const toggle = () => {
		clock.toggle();
		if (!$clock.running) {
			const hzItemSelectedIndices = getHzItemSelectedIndices();
			const hzSelectedIndex = hzItemSelectedIndices.at(-1)!;
			if (WINNING_HZ_ITEMS.has(hzSelectedIndex)) {
				setInStorage(STORAGE_KEY_STRENGTH_BOOSTER2, true);
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

<div class="view" on:click={toggle} aria-hidden>
	<div class="item" class:pulsing={$settings.secretEnabled}>
		<FreqSpeeds
			width={$dimensions.width}
			height={$dimensions.height / 2}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
			bind:getHzItemSelectedIndices
		/>
	</div>
	<div class="item" class:pulsing={$settings.secretEnabled}>
		<FreqSpeeds
			width={$dimensions.width}
			height={$dimensions.height / 2}
			style="transform: rotate(180deg);"
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
		/>
	</div>
</div>

<style>
	.view {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.item {
		display: flex;
	}
	.item:first-child {
		--pulsing_duration: 0.5s;
	}
</style>
