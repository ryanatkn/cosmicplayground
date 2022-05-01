<script lang="ts">
	import DomCanvas from '$lib/flat/DomCanvas.svelte';
	import PixiCanvas from '$lib/flat/PixiCanvas.svelte';
	import type {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';
	import type {Controller} from '$lib/flat/Controller';
	import type {Stage} from '$lib/flat/Stage';
	import type {ClockStore} from '$lib/app/clock';
	import type {PixiApp} from '$lib/app/pixi';

	export let worldWidth: number;
	export let worldHeight: number;
	// TODO added these view dimensions for the Pixi renderer but probably want to refactor,
	// maybe using the camera? then `worldWidth` above becomes `width` again
	export let viewWidth: number;
	export let viewHeight: number;
	export let viewportWidth: number;
	export let viewportHeight: number;
	export let stage: Stage;
	export let pixi: PixiApp;
	export let controller: Controller;
	export let domCanvasRenderer: DomCanvasRenderer | null = null;
	export let clock: ClockStore;

	$: ({moving} = controller);

	$: if (!$clock.running && $moving) clock.resume();

	$: if ($clock.running) {
		stage.update($clock.dt);
	}

	$: stage.resize(worldWidth, worldHeight, viewWidth, viewHeight, viewportWidth, viewportHeight);

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
	<PixiCanvas
		{worldWidth}
		{worldHeight}
		{viewWidth}
		{viewHeight}
		{viewportWidth}
		{viewportHeight}
		{stage}
		{pixi}
		{clock}
	/>
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
