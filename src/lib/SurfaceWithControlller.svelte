<script lang="ts">
	import {run} from 'svelte/legacy';

	import Surface from '$lib/Surface.svelte';
	import type {Controller} from '$lib/controller.js';

	interface Props {
		// TODO merge with `./Surface.svelte` and probably Surface2 as well
		controller: Controller;
	}

	let {controller}: Props = $props();

	let pointer_down = $state(false);
	let pointer_x: number | undefined = $state();
	let pointer_y: number | undefined = $state();

	// TODO does binding like this cause input to be delayed a frame? I think so

	run(() => {
		if (pointer_x !== undefined) controller.setPointerLocation(pointer_x, pointer_y!);
	});

	run(() => {
		if (controller.pointer_down !== pointer_down) controller.setPointerDown(pointer_down);
	});
</script>

<!-- TODO instead of trapping the click with `stopPropagation`,
allow it to bubble and do whatever
-->
<div class="surface-wrapper">
	<Surface bind:pointer_down bind:pointer_x bind:pointer_y />
</div>

<style>
	.surface-wrapper {
		position: absolute;
		inset: 0;
	}
</style>
