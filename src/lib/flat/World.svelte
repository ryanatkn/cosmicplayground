<script lang="ts">
	import DomCanvas from '$lib/flat/DomCanvas.svelte';
	import PixiCanvas from '$lib/flat/PixiCanvas.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {DomCanvasRenderer} from '$lib/flat/DomCanvasRenderer';
	import type {Controller} from '$lib/flat/Controller';
	import type {Stage} from '$lib/flat/stage';

	export let width: number;
	export let height: number;
	export let stage: Stage;
	export let controller: Controller;
	export let renderer = new DomCanvasRenderer();

	$: ({dirty} = renderer);
	$: ({moving} = controller);

	const clock = getClock();

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

<div class="world" style:width="{width}px" style:height="{height}px">
	<DomCanvas {width} {height} {stage} {renderer} />
	<PixiCanvas {width} {height} {stage} />
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
