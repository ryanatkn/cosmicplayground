<script lang="ts">
	import {run} from 'svelte/legacy';

	import {onMount} from 'svelte';

	import DomCanvas from '$lib/DomCanvas.svelte';
	import PixiCanvas from '$lib/PixiCanvas.svelte';
	import type {DomCanvasRenderer} from '$lib/DomCanvasRenderer.js';
	import type {Stage} from '$lib/stage.js';
	import {clock_context} from '$lib/clock.js';
	import type {PixiApp} from '$lib/pixi.js';

	// TODO added these view dimensions for the Pixi renderer but probably want to refactor,

	interface Props {
		stage: Stage;
		pixi?: PixiApp | null;
		domCanvasRenderer?: DomCanvasRenderer | null;
		worldWidth: number;
		worldHeight: number;
		// maybe using the camera? then `worldWidth` above becomes `width` again
		viewWidth: number;
		viewHeight: number;
		viewportWidth: number;
		viewportHeight: number;
		children?: import('svelte').Snippet;
	}

	let {
		stage,
		pixi = null,
		domCanvasRenderer = null,
		worldWidth,
		worldHeight,
		viewWidth,
		viewHeight,
		viewportWidth,
		viewportHeight,
		children,
	}: Props = $props();

	const clock = clock_context.get();

	onMount(() => {
		stage.update(0);
		forceRender();
	});

	// TODO rename? `rerender`?
	const forceRender = () => {
		pixi?.app.render();
	};

	// TODO actions -- refactor this with the controls in `__layout.svelte` and `index.svelte`
	const onKeydown = (e: KeyboardEvent) => {
		controller.handleKeydown(e.key);
	};
	const onKeyup = (e: KeyboardEvent) => {
		controller.handleKeyup(e.key);
	};
	run(() => {
		console.log(`pixi, domCanvasRenderer`, pixi, domCanvasRenderer);
	});
	let {controller} = $derived(stage);
	let {moving} = $derived(controller);
	let {running} = $derived($clock);
	run(() => {
		if (!running && $moving) clock.resume();
	});
	run(() => {
		if (running) {
			// TODO this needs to use the app ticker's dt
			stage.update($clock.dt);
		}
	});
	run(() => {
		stage.resize(worldWidth, worldHeight, viewWidth, viewHeight, viewportWidth, viewportHeight),
			!running && forceRender();
	});
</script>

<svelte:window onkeydown={onKeydown} onkeyup={onKeyup} />

<div class="world" style:width="{worldWidth}px" style:height="{worldHeight}px">
	{#if domCanvasRenderer}
		<DomCanvas width={worldWidth} height={worldHeight} {domCanvasRenderer} {stage} {clock} />
	{/if}
	{#if pixi}
		<PixiCanvas {stage} {pixi} {clock} />
	{/if}
	{@render children?.()}
</div>

<style>
	.world {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
