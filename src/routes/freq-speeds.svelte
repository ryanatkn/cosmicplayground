<script lang="ts">
	import FreqSpeeds from '$lib/portals/freq-speeds/FreqSpeeds.svelte';
	import {getClock} from '$lib/app/clock';
	import {getDimensions} from '$lib/app/dimensions';
	import {setInStorage} from '$lib/util/storage';
	import {STORAGE_KEY_STRENGTH_BOOSTER2} from '$lib/portals/home/data';
	import {getSettings} from '$lib/app/settings';

	// TODO give user control over speed in dialog

	const dimensions = getDimensions();
	const clock = getClock();
	const settings = getSettings();

	const hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];

	const WINNING_HZ_ITEMS = new Set([0, 119, 59, 60]);

	const toggle = () => {
		clock.toggle();
		if (!$clock.running) {
			const hzItemSelectedIndices = getHzItemSelectedIndices();
			const hzSelectedIndex = hzItemSelectedIndices.at(-1)!;
			if (WINNING_HZ_ITEMS.has(hzSelectedIndex)) {
				setInStorage(STORAGE_KEY_STRENGTH_BOOSTER2, true);
			}
		} else {
			if (!$settings.secretEnabled) {
				settings.update(($settings) => ({...$settings, secretEnabled: false}));
			}
		}
	};

	let getHzItemSelectedIndices: () => number[];
</script>

<div class="view" on:click={toggle}>
	<FreqSpeeds
		width={$dimensions.width}
		height={$dimensions.height / 2}
		elapsedTime={$clock.time}
		lowestHzItemCount={2}
		{hzItems}
		bind:getHzItemSelectedIndices
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
