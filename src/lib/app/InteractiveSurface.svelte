<script lang="ts">
	// TODO merge with `$lib/flat/InteractiveSurface.svelte`
	// TODO maybe pass camera2, but some components would need refactoring
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

	let dragging = false;
	let movedWhileDragging = false;
	let lastMouseX: number | null = null;
	let lastMouseY: number | null = null;

	const startDragging = () => {
		dragging = true;
		movedWhileDragging = false;
	};
	const stopDragging = () => {
		if (!dragging) return false;
		dragging = false;
		return movedWhileDragging;
	};
	const updateDragging = (clientX: number, clientY: number) => {
		const dx = lastMouseX === null ? 0 : lastMouseX - clientX;
		const dy = lastMouseY === null ? 0 : lastMouseY - clientY;
		moveCamera(dx / scale, dy / scale);
		movedWhileDragging = true;
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!inputEnabled) return;
		if (dragging) {
			updateDragging(e.clientX, e.clientY);
		}
		lastMouseX = e.clientX;
		lastMouseY = e.clientY;
	};
	const onMouseDown = () => {
		if (!inputEnabled) return;
		startDragging();
	};
	const onMouseUp = () => {
		if (!inputEnabled) return;
		stopDragging();
	};
	// const onMouseEnter = () => {
	// 	if (!inputEnabled) return;
	// };
	const onMouseLeave = () => {
		if (!inputEnabled) return;
		stopDragging();
	};
	const onWheel = (e: WheelEvent) => {
		if (!inputEnabled || lastMouseX === null || lastMouseY === null) return;
		const scaleDelta = e.deltaX + e.deltaY + e.deltaZ;
		zoomCamera(scaleDelta, lastMouseX, lastMouseY);
	};
	const onContextmenu = (e: MouseEvent) => {
		if (!e.shiftKey) {
			// handles mobile issue
			e.stopPropagation();
			e.preventDefault();
		}
	};
</script>

<!-- on:mouseenter={onMouseEnter} -->

<div
	class="interactive-surface"
	style="width: {width}px; height: {height}px;"
	on:mousemove|stopPropagation={onMouseMove}
	on:mousedown|stopPropagation={onMouseDown}
	on:mouseup|stopPropagation={onMouseUp}
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
