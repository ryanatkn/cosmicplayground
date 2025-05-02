<script lang="ts">
	import { run } from 'svelte/legacy';

	import {onMount} from 'svelte';

	import type {DomCanvasRenderer} from '$lib/DomCanvasRenderer.js';
	import type {ClockStore} from '$lib/clock.js';
	import type {Stage} from '$lib/stage.js';

	interface Props {
		width: number;
		height: number;
		domCanvasRenderer: DomCanvasRenderer; // TODO isn't reactive
		stage: Stage;
		clock: ClockStore;
	}

	let {
		width,
		height,
		domCanvasRenderer,
		stage,
		clock
	}: Props = $props();

	let el: HTMLCanvasElement = $state();
	let canvasWidth: number = $state();
	let canvasHeight: number = $state();


	const resize = (width: number, height: number): void => {
		domCanvasRenderer?.resize(width, height); // also updates `el` `width` and `height`
		canvasWidth = width;
		canvasHeight = height;
	};


	onMount(() => {
		domCanvasRenderer?.setCanvas(el);
		return () => {
			domCanvasRenderer?.unsetCanvas();
		};
	});
	run(() => {
		if (el && (canvasWidth !== width || canvasHeight !== height)) {
			resize(width, height);
		}
	});
	let dirty = $derived(domCanvasRenderer?.dirty);
	run(() => {
		if (domCanvasRenderer?.ctx && ($clock.running || $dirty)) {
			domCanvasRenderer.clear();
			domCanvasRenderer.render(stage.sim.entities, stage.$camera);
		}
	});
</script>

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
</style>
