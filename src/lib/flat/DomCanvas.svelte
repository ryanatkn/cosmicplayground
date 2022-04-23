<script lang="ts">
	import {onMount} from 'svelte';

	import type {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';
	import type {Stage} from '$lib/flat/stage';

	export let width: number;
	export let height: number;
	export let stage: Stage;
	export let renderer: DomCanvasRenderer; // TODO isn't reactive

	let el: HTMLCanvasElement;
	let canvasWidth: number;
	let canvasHeight: number;

	let mounted = false;
	$: if (mounted && (canvasWidth !== width || canvasHeight !== height)) {
		resize(width, height);
	}

	const resize = (width: number, height: number): void => {
		// TODO maybe refactor this component to fire a `resize` event
		stage.resize(width, height);
		renderer.resize(width, height); // also updates `el` `width` and `height`
		canvasWidth = width;
		canvasHeight = height;
	};

	onMount(() => {
		renderer.setCanvas(el);
		mounted = true;
		return () => {
			renderer.unsetCanvas();
		};
	});
</script>

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
