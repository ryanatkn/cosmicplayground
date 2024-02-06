<script lang="ts">
	import type {Writable} from 'svelte/store';
	import {round} from '@ryanatkn/belt/maths.js';

	import FloatingTextButton from '$lib/FloatingTextButton.svelte';
	import TourControls from '$lib/TourControls.svelte';
	import type Tour from '$lib/Tour.svelte';

	export let tour: Tour | null;
	export let x: Writable<number>;
	export let y: Writable<number>;
	export let scale: Writable<number>;
	export let togglePixiEarthViewer: (visible: boolean) => void;
	export let enablePixiEarthViewer: boolean;
	export let debug_start_time: number;

	$: touring = tour?.touring;
</script>

<FloatingTextButton
	on:click={() => {
		togglePixiEarthViewer(!enablePixiEarthViewer);
	}}
>
	{enablePixiEarthViewer ? 'webgl' : 'dom'}
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		$scale = Number(prompt('🔎', $scale + '')) || $scale; // eslint-disable-line no-alert
	}}
>
	scale: {round($scale, 1)}
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
		const inputValue = Number(prompt('x', $x + '')); // eslint-disable-line no-alert
		if (!Number.isNaN(inputValue)) {
			$x = inputValue;
		}
	}}
>
	x: {Math.round($x)}
</FloatingTextButton>
<FloatingTextButton
	on:click={() => {
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
