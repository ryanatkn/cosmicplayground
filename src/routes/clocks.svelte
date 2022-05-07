<script lang="ts">
	import {onDestroy} from 'svelte';

	import FreqSpeeds from '$lib/portals/freq-speeds/FreqSpeeds.svelte';
	import {getClock} from '$lib/app/clock';
	import {getDimensions} from '$lib/app/dimensions';
	import {setInStorage} from '$lib/util/storage';
	import {STORAGE_KEY_STRENGTH_BOOSTER1} from '$lib/portals/home/data';
	import {getSettings} from '$lib/app/settings';
	import FreqSpectacle from '$lib/portals/freq-spectacle/FreqSpectacle.svelte';

	// TODO give user control over speed in dialog

	const dimensions = getDimensions();
	const clock = getClock();
	const settings = getSettings();

	const hzItems = [9, 15, 24];
	const WINNING_HZ_ITEMS = new Set([0]);

	const toggle = () => {
		clock.toggle();
		if (!$clock.running) {
			const hzItemSelectedIndices = getHzItemSelectedIndices();
			const hzSelectedIndex = hzItemSelectedIndices.at(-1)!;
			console.log(`hzSelectedIndex`, hzSelectedIndex);
			if (WINNING_HZ_ITEMS.has(hzSelectedIndex)) {
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
</script>

<div class="view" on:click={toggle}>
	<div class="item" class:pulsing={$settings.secretEnabled}>
		<FreqSpeeds
			width={$dimensions.width / 2}
			height={$dimensions.height}
			style="transform: scale3d(-1, 1, 1);"
			elapsedTime={$clock.time / 4}
			lowestHzItemCount={1}
			{hzItems}
			bind:getHzItemSelectedIndices
		/>
		<FreqSpectacle
			width={$dimensions.width * 0.5}
			height={$dimensions.height}
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
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}
	.item {
		display: flex;
		position: absolute;
		inset: 0;
	}
	.item:first-child {
		--pulsing_duration: 0.5s;
	}
</style>
