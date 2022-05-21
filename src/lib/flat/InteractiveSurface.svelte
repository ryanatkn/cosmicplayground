<script lang="ts">
	import type {Controller} from '$lib/flat/Controller';

	// TODO merge with `$lib/app/InteractiveSurface.svelte`

	export let controller: Controller;

	let el: HTMLElement;

	const updatePointer = (e: {clientX: number; clientY: number}) => {
		controller.setPointerLocation(e.clientX - el.clientLeft, e.clientY - el.clientTop);
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
	// const onContextmenu = (e: MouseEvent) => {
	// 	if (!e.shiftKey) {
	// 		// handles mobile issue (maybe do touch events instead?)
	// 		e.stopPropagation();
	// 		e.preventDefault();
	// 	}
	// };

	// TODO can we mount only for mobile?
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

<!-- on:contextmenu={onContextmenu} -->

<!-- TODO instead of trapping the click with `stopPropagation`,
allow it to bubble and do whatever
-->
<div
	bind:this={el}
	class="interactive-surface"
	on:mousedown|stopPropagation|preventDefault={onMousedown}
	on:mouseup|stopPropagation|preventDefault={onMouseup}
	on:mousemove|stopPropagation|preventDefault={onMousemove}
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
		user-select: none;
	}
</style>
