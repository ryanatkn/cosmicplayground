<script lang="ts">
	import {onDestroy} from 'svelte';
	import {clock_context} from '$lib/clock.js';
	import {dimensions_context} from '$lib/dimensions.js';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';
	import {setInStorage} from '$lib/storage.js';
	import {STORAGE_KEY_STRENGTH_BOOSTER1} from '$routes/data.js';
	import {settings_context} from '$lib/settings.js';
	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';

	// TODO give user control over speed in dialog

	const dimensions = dimensions_context.get();
	const clock = clock_context.get();
	const settings = settings_context.get();

	const hzItems = [9, 15, 24];
	const WINNING_HZ_ITEMS = new Set([0]);

	const toggle = () => {
		clock.toggle();
		if (!$clock.running) {
			const hzSelectedIndex = getHzItemSelectedIndices().at(-1)!;
			const hzSelectedIndex2 = getHzItemSelectedIndices2().at(-1)!;
			if (WINNING_HZ_ITEMS.has(hzSelectedIndex) && WINNING_HZ_ITEMS.has(hzSelectedIndex2)) {
				setInStorage(STORAGE_KEY_STRENGTH_BOOSTER1, true);
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

	let getHzItemSelectedIndices: () => number[] = $state();
	let getHzItemSelectedIndices2: () => number[] = $state();
</script>

<div class="view" onclick={toggle} aria-hidden="true">
	<div class="item" class:pulsing={$settings.secret_enabled}>
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
	<div class="item" class:pulsing={$settings.secret_enabled}>
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
