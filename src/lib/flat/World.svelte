<script lang="ts">
	import Canvas from '$lib/flat/Canvas.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {CanvasRenderer} from '$lib/flat/CanvasRenderer';
	import type {Controller} from '$lib/flat/Controller';
	import type {Stage} from '$lib/flat/stage';

	export let width: number;
	export let height: number;
	export let stage: Stage;
	export let controller: Controller;
	export let renderer = new CanvasRenderer();

	$: ({dirty} = renderer);
	$: ({moving} = controller);

	const clock = getClock();

	$: if (!$clock.running && $moving && stage.status === 'success') clock.resume();

	$: if (($clock.running || $dirty) && renderer.ctx && stage && stage.status === 'success') {
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
	<Canvas {width} {height} {stage} {renderer} />
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
