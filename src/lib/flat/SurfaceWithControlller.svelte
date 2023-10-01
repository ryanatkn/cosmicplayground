<script lang="ts">
	import Surface from '@feltjs/felt-mural/Surface.svelte';

	import type {Controller} from '$lib/flat/controller.js';

	// TODO merge with `./Surface.svelte`

	export let controller: Controller;

	let pointerDown = false;
	let pointerX: number | undefined;
	let pointerY: number | undefined;

	// TODO does binding like this cause input to be delayed a frame? I think so

	$: if (pointerX !== undefined) controller.setPointerLocation(pointerX, pointerY!);

	$: if (controller.pointerDown !== pointerDown) controller.setPointerDown(pointerDown);
</script>

<!-- TODO instead of trapping the click with `stopPropagation`,
allow it to bubble and do whatever
-->
<div class="surface-wrapper">
	<Surface bind:pointerDown bind:pointerX bind:pointerY />
</div>

<style>
	.surface-wrapper {
		position: absolute;
		inset: 0;
	}
</style>
