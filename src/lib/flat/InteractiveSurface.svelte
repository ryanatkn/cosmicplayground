<script lang="ts">
	import {type Controller} from '$lib/flat/Controller';

	// TODO same name as `$lib/app/InteractiveSurface.svelte` but different

	export const width: number = undefined as any; // TODO ? see below
	export const height: number = undefined as any; // TODO ? see below
	export let controller: Controller;

	let el: HTMLElement;

	const updatePointer = (e: {clientX: number; clientY: number}) => {
		controller.setPointerLocation(
			e.clientX - el!.clientLeft, //  - width / 2
			e.clientY - el!.clientTop, //  - height / 2
		);
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

	// TODO mount only for mobile
	// TODO handle all touches
	// const onTouchstart = (e: TouchEvent) => {
	// 	updatePointer(e.changedTouches[0]);
	// 	controller.setPointerDown(true);
	// };
	// const onTouchend = (e: TouchEvent) => {
	// 	updatePointer(e.changedTouches[0]);
	// 	controller.setPointerDown(false);
	// };
	// const onTouchcancel = (e: TouchEvent) => {
	// 	updatePointer(e.changedTouches[0]);
	// 	controller.setPointerDown(false);
	// };
	// const onTouchmove = (e: TouchEvent) => {
	// 	updatePointer(e.changedTouches[0]);
	// };
	// on:touchstart={onTouchstart}
	// on:touchend={onTouchend}
	// on:touchcancel={onTouchcancel}
	// on:touchmove={onTouchmove}
</script>

<!-- TODO instead of trapping the click with `stopPropagation`,
allow it to bubble and do whatever
-->
<div
	bind:this={el}
	class="interactive-surface"
	on:mousedown={onMousedown}
	on:mouseup={onMouseup}
	on:mousemove={onMousemove}
	on:mouseenter={onMouseenter}
	on:mouseleave={onMouseleave}
/>

<style>
	.interactive-surface {
		position: absolute;
		inset: 0;
	}
</style>
