<script lang="ts">
	import {onDestroy} from 'svelte';
	import {clock_context} from '$lib/clock.js';
	import {get_dimensions} from '$lib/dimensions.js';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';
	import {get_settings} from '$lib/settings.js';
	import {unlock_satisfying_secret} from '$lib/secret';

	// TODO give user control over speed in dialog

	const dimensions = get_dimensions();
	const clock = clock_context.get();
	const settings = get_settings();

	const hzItems = [1, 24, 30, 48, 60, 144];
	const WINNING_HZ_ITEMS = new Set([0, 143, 144, 287]);

	const toggle = () => {
		clock.toggle();
		if (!$clock.running) {
			const hzItemSelectedIndices = getHzItemSelectedIndices();
			const hzSelectedIndex = hzItemSelectedIndices.at(-1)!;
			if (WINNING_HZ_ITEMS.has(hzSelectedIndex)) {
				unlock_satisfying_secret();
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

<div class="view" onclick={toggle} aria-hidden="true">
	<div class="item" class:pulsing={$settings.secret_enabled}>
		<FreqSpeeds
			width={$dimensions.width}
			height={$dimensions.height / 2}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			{hzItems}
			bind:getHzItemSelectedIndices
		/>
	</div>
	<div class="item" class:pulsing={$settings.secret_enabled}>
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
