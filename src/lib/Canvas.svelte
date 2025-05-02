<script lang="ts">
	import { run } from 'svelte/legacy';

	import {onMount} from 'svelte';

	import type {CanvasRenderer} from '$lib/CanvasRenderer.js';
	import type {Stage} from '$lib/stage.js';

	interface Props {
		width: number;
		height: number;
		stage: Stage;
		renderer: CanvasRenderer; // TODO isn't reactive
	}

	let {
		width,
		height,
		stage,
		renderer
	}: Props = $props();

	let el: HTMLCanvasElement = $state();
	let canvasWidth: number = $state();
	let canvasHeight: number = $state();

	// TODO this should be from the `World` not decided here
	let size = $derived(Math.min(width, height));

	run(() => {
		if (canvasWidth !== width || canvasHeight !== height) {
			// TODO maybe refactor this component to fire a `resize` event
			stage.resize(size, size, size, size, size, size); // TODO uhh
			renderer.resize(size, size); // also updates `el` `width` and `height`
			canvasWidth = size;
			canvasHeight = size;
		}
	});

	onMount(() => {
		renderer.setCanvas(el);
		return () => {
			renderer.unsetCanvas();
		};
	});
</script>

<!-- TODO instead of trapping the click with `stopPropagation`,
allow it to bubble and do whatever
-->
<div class="canvas">
	<canvas bind:this={el}></canvas>
</div>

<style>
	.canvas {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	canvas {
		background-color: #000;
	}
</style>
