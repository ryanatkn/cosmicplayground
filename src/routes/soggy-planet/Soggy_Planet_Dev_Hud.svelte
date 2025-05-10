<script lang="ts">
	import type {Writable} from 'svelte/store';

	import FloatingTextButton from '$lib/FloatingTextButton.svelte';
	import type Tour from '$lib/Tour.svelte';
	import TourControls from '$lib/TourControls.svelte';
	import {settings_context} from '$lib/settings.js';

	interface Props {
		tour: Tour | null;
		x: Writable<number>;
		y: Writable<number>;
		scale: Writable<number>;
		debug_start_time: number;
	}

	let {tour, x, y, scale, debug_start_time}: Props = $props();

	let touring = $derived(tour?.touring);

	const settings = settings_context.get();
	let {audio_enabled} = $derived($settings);

	const toggle_audio_enabled = (value = !audio_enabled): void =>
		settings.update((v) => ({...v, audio_enabled: value}));
</script>

<FloatingTextButton onclick={() => toggle_audio_enabled()}>
	{#if audio_enabled}unmuted{:else}muted{/if}
</FloatingTextButton><FloatingTextButton
	onclick={() => {
		$scale = Number(prompt('🔎', $scale + '')) || $scale; // eslint-disable-line no-alert
	}}
>
	scale: {Math.round($scale * 10) / 10}
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		const inputValue = Number(prompt('x', $x + '')); // eslint-disable-line no-alert
		if (!Number.isNaN(inputValue)) {
			$x = inputValue;
		}
	}}
>
	x: {Math.round($x)}
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		const inputValue = Number(prompt('y', $y + '')); // eslint-disable-line no-alert
		if (!Number.isNaN(inputValue)) {
			$y = inputValue;
		}
	}}
>
	y: {Math.round($y)}
</FloatingTextButton>
{#if tour && $touring}
	<TourControls {tour} {debug_start_time} />
{/if}
