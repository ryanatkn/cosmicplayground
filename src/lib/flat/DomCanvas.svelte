<script lang="ts">
	import {onMount} from 'svelte';

	import type {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';

	export let width: number;
	export let height: number;
	export let domCanvasRenderer: DomCanvasRenderer; // TODO isn't reactive

	let el: HTMLCanvasElement;
	let canvasWidth: number;
	let canvasHeight: number;

	$: if (el && (canvasWidth !== width || canvasHeight !== height)) {
		resize(width, height);
	}

	const resize = (width: number, height: number): void => {
		domCanvasRenderer.resize(width, height); // also updates `el` `width` and `height`
		canvasWidth = width;
		canvasHeight = height;
	};

	onMount(() => {
		domCanvasRenderer.setCanvas(el);
		return () => {
			domCanvasRenderer.unsetCanvas();
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
