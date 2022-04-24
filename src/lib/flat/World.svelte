<script lang="ts">
	import DomCanvas from '$lib/flat/DomCanvas.svelte';
	import PixiCanvas from '$lib/flat/PixiCanvas.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';
	import type {Controller} from '$lib/flat/Controller';
	import type {Stage} from '$lib/flat/stage';

	export let worldWidth: number;
	export let worldHeight: number;
	// TODO added these view dimensions for the Pixi renderer but probably want to refactor,
	// maybe using the camera? then `worldWidth` above becomes `width` again
	export let viewWidth: number;
	export let viewHeight: number;
	export let stage: Stage;
	export let controller: Controller;
	export let renderer = new DomCanvasRenderer();

	$: ({dirty} = renderer);
	$: ({moving} = controller);

	const clock = getClock();
	// TODO ensure clock stopping stops pixi rendering

	$: if (!$clock.running && $moving) clock.resume();

	$: if (($clock.running || $dirty) && renderer.ctx) {
		if ($clock.running) {
			stage.update($clock.dt);
		}
		stage.render(renderer);
	}

	// TODO actions
	const onKeydown = (e: KeyboardEvent) => {
		controller.handleKeydown(e.key);
	};
	const onKeyup = (e: KeyboardEvent) => {
		controller.handleKeyup(e.key);
	};
</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} />

<div class="world" style:width="{worldWidth}px" style:height="{worldHeight}px">
	<DomCanvas width={worldWidth} height={worldHeight} {stage} {renderer} />
	<PixiCanvas {worldWidth} {worldHeight} {viewWidth} {viewHeight} {stage} />
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
