<script lang="ts">
	import {swallow} from '@feltjs/util/dom.js';

	// TODO BLOCK pinch to zoom - https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures

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

	const wheel = (e: WheelEvent) => {
		if (!inputEnabled || pointerX === null || pointerY === null) return;
		const scaleDelta = e.deltaX + e.deltaY + e.deltaZ;
		zoomCamera(scaleDelta, pointerX, pointerY);
	};

	// TODO mount only for mobile
	// TODO handle all touches not just the first
	const pointerdown = (e: PointerEvent) => {
		console.log(`pointerdown`, e.pointerId, e.pointerType, e.isPrimary);
		if (!inputEnabled) return;
		swallow(e);
		updatePointerPosition(e.clientX, e.clientY);
		pointerDown = true;
		focus();
	};
	const pointerup = (e: PointerEvent) => {
		console.log(`pointerup`, e.pointerId, e.pointerType, e.isPrimary);
		if (!inputEnabled) return;
		swallow(e);
		updatePointerPosition(e.clientX, e.clientY);
		pointerDown = false;
	};
	const pointerleave = (e: PointerEvent) => {
		console.log(`pointerleave`, e.pointerId, e.pointerType, e.isPrimary);
		if (!inputEnabled) return;
		swallow(e);
		updatePointerPosition(e.clientX, e.clientY);
		pointerDown = false;
		pointerX = null;
		pointerY = null;
	};
	const pointermove = (e: PointerEvent) => {
		console.log(`pointermove`, e.pointerId, e.pointerType, e.isPrimary);
		if (!inputEnabled) return;
		swallow(e);
		updatePointerPosition(e.clientX, e.clientY);
	};
</script>

<!-- on:mouseenter={onMouseEnter} -->

<div
	bind:this={el}
	class="surface"
	style="width: {width}px; height: {height}px;"
	on:wheel|passive={wheel}
	on:pointerdown={pointerdown}
	on:pointerup={pointerup}
	on:pointermove={pointermove}
	on:pointerleave={pointerleave}
	on:pointercancel={pointerleave}
>
	<slot />
</div>

<style>
	.surface {
		-webkit-user-select: none;
		user-select: none;
		touch-action: none;
	}
</style>
