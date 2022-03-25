<script lang="ts">
	import type {Writable} from 'svelte/store';

	import FloatingTextButton from '$lib/app/FloatingTextButton.svelte';

	export let x: Writable<number>;
	export let y: Writable<number>;
	export let scale: Writable<number>;
	export let togglePixiEarthViewer: (visible: boolean) => void;
	export let enablePixiEarthViewer: boolean;

	// TODO smaller buttons! size prop?
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
	scale: {Math.round($scale * 10) / 10}
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
