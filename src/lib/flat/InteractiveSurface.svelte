<script lang="ts">
	import {type Controller} from '$lib/flat/Controller';

	export let width: number;
	export let height: number;
	export let controller: Controller;

	let pointerX: number | null = null;
	let pointerY: number | null = null;

	$: size = Math.min(width, height);

	$: controller.setPointerLocation(pointerX, pointerY);

	const updatePointer = (e: {clientX: number; clientY: number}) => {
		pointerX = e.clientX - (width - size) / 2;
		pointerY = e.clientY - (height - size) / 2;
	};

	const onMousedown = (e: MouseEvent) => {
		updatePointer(e);
		controller.setPointerDown(true);
	};
	const onMouseup = (e: MouseEvent) => {
		updatePointer(e);
		controller.setPointerDown(false);
	};
	const onMousemove = (e: MouseEvent) => {
		updatePointer(e);
	};
	const onMouseenter = (e: MouseEvent) => {
		updatePointer(e);
	};
	const onMouseleave = (e: MouseEvent) => {
		updatePointer(e);
		controller.setPointerDown(false);
	};

	// TODO handle all touches
	const onTouchstart = (e: TouchEvent) => {
		updatePointer(e.changedTouches[0]);
		controller.setPointerDown(true);
	};
	const onTouchend = (e: TouchEvent) => {
		updatePointer(e.changedTouches[0]);
		controller.setPointerDown(false);
	};
	const onTouchcancel = (e: TouchEvent) => {
		updatePointer(e.changedTouches[0]);
		controller.setPointerDown(false);
	};
	const onTouchmove = (e: TouchEvent) => {
		updatePointer(e.changedTouches[0]);
	};
</script>

<!-- TODO instead of trapping the click with `stopPropagation`,
allow it to bubble and do whatever
-->
<div
	class="interactive-surface"
	on:click|stopPropagation
	on:mousedown={onMousedown}
	on:mouseup={onMouseup}
	on:mousemove={onMousemove}
	on:mouseenter={onMouseenter}
	on:mouseleave={onMouseleave}
	on:touchstart={onTouchstart}
	on:touchend={onTouchend}
	on:touchcancel={onTouchcancel}
	on:touchmove={onTouchmove}
/>

<style>
	.interactive-surface {
		position: absolute;
		inset: 0;
	}
</style>
