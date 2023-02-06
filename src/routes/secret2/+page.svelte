<script lang="ts">
	import {onDestroy} from 'svelte';
	import {getClock, getDimensions} from '@feltcoop/dealt';

	import FreqSpeeds from '../freq-speeds/FreqSpeeds.svelte';
	import {getSettings} from '$lib/app/settings';
	import {unlockSatisfyingSecret} from '$lib/util/secret';

	// TODO give user control over speed in dialog

	const dimensions = getDimensions();
	const clock = getClock();
	const settings = getSettings();

	const hzItems = [1, 24, 30, 48, 60, 144];
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
