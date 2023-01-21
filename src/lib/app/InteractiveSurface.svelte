<script lang="ts">
	import {swallow} from '@feltcoop/util/dom.js';

	// TODO merge with `$lib/flat/InteractiveSurface.svelte`
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

		// TODO BLOCK correctly handle scale
		pointerX = clientX - rect.left; //  / scale;
		pointerY = clientY - rect.top; // / scale;
		console.log(`pointerX, pointerY`, pointerX, pointerY);
	};
	const startDragging = () => {
		pointerDown = true;
	};
	const stopDragging = () => {
		pointerDown = false;
	};

	const onMouseMove = (e: MouseEvent) => {
		console.log(`mouseMove`);
		if (!inputEnabled) return;
		swallow(e);
		updatePointerPosition(e.clientX, e.clientY);
	};
	const onMouseDown = (e: MouseEvent) => {
		console.log('mousedown');
		if (!inputEnabled) return;
		swallow(e);
		startDragging();
	};
	const onMouseUp = (e: MouseEvent) => {
		console.log('mouseup');
		if (!inputEnabled) return;
		swallow(e);
		stopDragging();
	};
	const onMouseLeave = () => {
		console.log('mouseleave');
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
	const onContextmenu = (e: MouseEvent) => {
		if (!e.shiftKey) {
			// TODO BLOCK use touch events with a `touch` flag
			// handles mobile issue
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
	on:contextmenu={onContextmenu}
>
	<slot />
</div>

<style>
	.interactive-surface {
		user-select: none;
	}
</style>
