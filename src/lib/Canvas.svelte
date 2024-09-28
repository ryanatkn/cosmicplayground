<script lang="ts">
	import {onMount} from 'svelte';

	import type {CanvasRenderer} from '$lib/CanvasRenderer.js';
	import type {Stage} from '$lib/stage.js';

	export let width: number;
	export let height: number;
	export let stage: Stage;
	export let renderer: CanvasRenderer; // TODO isn't reactive

	let el: HTMLCanvasElement;
	let canvasWidth: number;
	let canvasHeight: number;

	// TODO this should be from the `World` not decided here
	$: size = Math.min(width, height);

	$: if (canvasWidth !== width || canvasHeight !== height) {
		// TODO maybe refactor this component to fire a `resize` event
		stage.resize(size, size, size, size, size, size); // TODO uhh
		renderer.resize(size, size); // also updates `el` `width` and `height`
		canvasWidth = size;
		canvasHeight = size;
	}

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
	<canvas bind:this={el} />
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
