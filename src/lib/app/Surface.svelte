<script lang="ts">
	import {swallow} from '@feltjs/util/dom.js';

	// TODO pinch to zoom - https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures

	// TODO merge with `@feltcoop/dealt/Surface.svelte`
	// TODO maybe pass camera, but some components would need refactoring
	export let width: number;
	export let height: number;
	export let scale: number;
	export let zoomCamera: (
		zoomDirection: number,
		screenPivotX: number,
		screenPivotY: number,
	) => void;
	export let moveCamera: (dx: number, dy: number) => void;
	export let inputEnabled = true;

	// TODO dispatch events (instead or in addition to binding?)
	// exported for binding
	export let pointerDown = false;
	export let pointerX: number | null = null;
	export let pointerY: number | null = null;

	let el: HTMLDivElement;
	let touch = false;

	const updatePointerPosition = (clientX: number, clientY: number): void => {
		const rect = el.getBoundingClientRect();

		// update dragging
		if (pointerDown) {
			const dx = pointerX === null ? 0 : pointerX - clientX;
			const dy = pointerY === null ? 0 : pointerY - clientY;
			moveCamera(dx / scale, dy / scale);
		}

		// TODO correctly handle when the DOM element itself is scaled -- maybe the existing `scale` should be `zoom` and this is `scale`?
		pointerX = clientX - rect.left; //  / domElementScale;
		pointerY = clientY - rect.top; // / domElementScale;
	};
	const startDragging = () => {
		pointerDown = true;
	};
	const stopDragging = () => {
		pointerDown = false;
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		updatePointerPosition(e.clientX, e.clientY);
	};
	const onMouseDown = (e: MouseEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		startDragging();
	};
	const onMouseUp = (e: MouseEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		stopDragging();
	};
	const onMouseLeave = () => {
		if (!inputEnabled) return;
		stopDragging();
		pointerX = null;
		pointerY = null;
	};
	const onWheel = (e: WheelEvent) => {
		if (!inputEnabled || pointerX === null || pointerY === null) return;
		const scaleDelta = e.deltaX + e.deltaY + e.deltaZ;
		zoomCamera(scaleDelta, pointerX, pointerY);
	};

	// TODO mount only for mobile
	// TODO handle all touches not just the first
	const onTouchstart = (e: TouchEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		touch = true;
		updatePointerPosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		pointerDown = true;
		focus();
	};
	const onTouchend = (e: TouchEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		touch = true;
		updatePointerPosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		pointerDown = false;
	};
	const onTouchcancel = (e: TouchEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		touch = true;
		updatePointerPosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		pointerDown = false;
	};
	const onTouchmove = (e: TouchEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		touch = true;
		updatePointerPosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	};

	const onContextmenu = (e: MouseEvent) => {
		if (touch && !e.shiftKey) {
			swallow(e);
		}
	};
</script>

<!-- on:mouseenter={onMouseEnter} -->

<div
	bind:this={el}
	class="interactive-surface"
	style="width: {width}px; height: {height}px;"
	on:mousemove={onMouseMove}
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	on:mouseleave={onMouseLeave}
	on:wheel|passive={onWheel}
	on:touchstart={onTouchstart}
	on:touchend={onTouchend}
	on:touchcancel={onTouchcancel}
	on:touchmove={onTouchmove}
	on:contextmenu={onContextmenu}
>
	<slot />
</div>

<style>
	.interactive-surface {
		user-select: none;
	}
</style>
