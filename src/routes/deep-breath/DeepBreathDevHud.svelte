<script lang="ts">
	import type {Writable} from 'svelte/store';
	import {round} from '@ryanatkn/belt/maths.js';

	import FloatingTextButton from '$lib/FloatingTextButton.svelte';
	import TourControls from '$lib/TourControls.svelte';
	import type Tour from '$lib/Tour.svelte';

	interface Props {
		tour: Tour | null;
		x: Writable<number>;
		y: Writable<number>;
		scale: Writable<number>;
		togglePixiEarthViewer: (visible: boolean) => void;
		enablePixiEarthViewer: boolean;
		debug_start_time: number;
	}

	let {
		tour,
		x,
		y,
		scale,
		togglePixiEarthViewer,
		enablePixiEarthViewer,
		debug_start_time
	}: Props = $props();

	let touring = $derived(tour?.touring);
</script>

<FloatingTextButton
	onclick={() => {
		togglePixiEarthViewer(!enablePixiEarthViewer);
	}}
>
	{enablePixiEarthViewer ? 'webgl' : 'dom'}
</FloatingTextButton>
<FloatingTextButton
	onclick={() => {
		$scale = Number(prompt('🔎', $scale + '')) || $scale; // eslint-disable-line no-alert
	}}
>
	scale: {round($scale, 1)}
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
