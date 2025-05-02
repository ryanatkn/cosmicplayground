<script lang="ts">
	import { run } from 'svelte/legacy';

	import {onDestroy} from 'svelte';

	import type {Stage} from '$lib/stage.js'; // TODO shouldnt import this
	import type {ClockStore} from '$lib/clock.js';
	import type {PixiApp} from '$lib/pixi.js';

	interface Props {
		pixi: PixiApp; // is not reactive
		stage: Stage; // is not reactive
		clock: ClockStore;
	}

	let { pixi, stage, clock }: Props = $props();

	let {running} = $derived($clock);

	const {container, camera} = stage;
	pixi.current_scene.addChild(container);
	onDestroy(() => {
		pixi.current_scene.removeChild(container);
	});

	// This stops the app's rendering when paused for efficiency.
	// TODO It will need some tweaking if/when we add camera zoom.
	// TODO It'd also be nice to have a general solution, not hardcoded to this one component,
	// and a better solution is probably to integrate the clock with `pixi` (and its ticker? but what about canvas rendering?)
	run(() => {
		if (running) {
			pixi.app.start();
		} else {
			pixi.app.stop();
			void camera.setPosition($camera.x, $camera.y, {hard: true});
		}
	});
	onDestroy(() => {
		// render because the stage is paused initially
		// TODO refactor with clock?
		pixi.app.render();
		pixi.app.start();
	});
</script>
