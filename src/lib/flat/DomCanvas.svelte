<script lang="ts">
	import {onMount} from 'svelte';

	import type {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';
	import type {ClockStore} from '$lib/flat/clock';
	import type {Stage} from '$lib/flat/stage';

	export let width: number;
	export let height: number;
	export let domCanvasRenderer: DomCanvasRenderer; // TODO isn't reactive
	export let stage: Stage;
	export let clock: ClockStore;

	let el: HTMLCanvasElement;
	let canvasWidth: number;
	let canvasHeight: number;

	$: if (el && (canvasWidth !== width || canvasHeight !== height)) {
		resize(width, height);
	}

	const resize = (width: number, height: number): void => {
		domCanvasRenderer?.resize(width, height); // also updates `el` `width` and `height`
		canvasWidth = width;
		canvasHeight = height;
	};

	$: dirty = domCanvasRenderer?.dirty;
	$: if (domCanvasRenderer?.ctx && ($clock.running || $dirty)) {
		domCanvasRenderer.clear();
		domCanvasRenderer.render(stage.sim.entities, stage.$camera);
	}

	onMount(() => {
		domCanvasRenderer?.setCanvas(el);
		return () => {
			domCanvasRenderer?.unsetCanvas();
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
