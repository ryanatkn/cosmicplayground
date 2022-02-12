<script lang="ts">
	import {onMount} from 'svelte';

	import {type CanvasRenderer} from '$lib/flat/CanvasRenderer';
	import {type Stage} from '$lib/flat/stage';

	export let width: number;
	export let height: number;
	export let stage: Stage;
	export let renderer: CanvasRenderer; // TODO isn't reactive

	let el: HTMLCanvasElement;
	let canvasWidth: number;
	let canvasHeight: number;

	$: if (canvasWidth !== width || canvasHeight !== height) {
		// TODO maybe refactor this component to fire a `resize` event
		stage.resize(width, height);
		renderer.resize(width, height); // also updates `el` `width` and `height`
		canvasWidth = width;
		canvasHeight = height;
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
</style>
