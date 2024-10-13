<script lang="ts">
	import {onMount} from 'svelte';

	import DomCanvas from '$lib/DomCanvas.svelte';
	import PixiCanvas from '$lib/PixiCanvas.svelte';
	import type {DomCanvasRenderer} from '$lib/DomCanvasRenderer.js';
	import type {Stage} from '$lib/stage.js';
	import {clock_context} from '$lib/clock.js';
	import type {PixiApp} from '$lib/pixi.js';

	export let stage: Stage;
	export let pixi: PixiApp | null = null;
	export let domCanvasRenderer: DomCanvasRenderer | null = null;
	export let worldWidth: number;
	export let worldHeight: number;
	// TODO added these view dimensions for the Pixi renderer but probably want to refactor,
	// maybe using the camera? then `worldWidth` above becomes `width` again
	export let viewWidth: number;
	export let viewHeight: number;
	export let viewportWidth: number;
	export let viewportHeight: number;
	$: console.log(`pixi, domCanvasRenderer`, pixi, domCanvasRenderer);

	$: ({controller} = stage);
	$: ({moving} = controller);

	const clock = clock_context.get();
	$: ({running} = $clock);

	$: if (!running && $moving) clock.resume();

	onMount(() => {
		stage.update(0);
		forceRender();
	});

	$: if (running) {
		// TODO this needs to use the app ticker's dt
		stage.update($clock.dt);
	}

	$: stage.resize(worldWidth, worldHeight, viewWidth, viewHeight, viewportWidth, viewportHeight),
		!running && forceRender();

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
</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} />

<div class="world" style:width="{worldWidth}px" style:height="{worldHeight}px">
	{#if domCanvasRenderer}
		<DomCanvas width={worldWidth} height={worldHeight} {domCanvasRenderer} {stage} {clock} />
	{/if}
	{#if pixi}
		<PixiCanvas {stage} {pixi} {clock} />
	{/if}
	<slot />
</div>

<style>
	.world {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
