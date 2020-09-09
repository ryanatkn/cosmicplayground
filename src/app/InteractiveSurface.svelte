<script>
	export let width;
	export let height;
	export let scale;
	export let zoomCamera;
	export let moveCamera;
	export let inputEnabled = true;

	let dragging = false;
	let movedWhileDragging = false;
	let lastMouseX = null;
	let lastMouseY = null;

	const startDragging = () => {
		dragging = true;
		movedWhileDragging = false;
	};
	const stopDragging = () => {
		if (!dragging) return false;
		dragging = false;
		return movedWhileDragging;
	};
	const updateDragging = (clientX, clientY) => {
		const dx = lastMouseX === null ? 0 : lastMouseX - clientX;
		const dy = lastMouseY === null ? 0 : lastMouseY - clientY;
		moveCamera(dx / scale, dy / scale);
		movedWhileDragging = true;
	};

	const onMouseMove = (e) => {
		if (!inputEnabled) return;
		if (dragging) {
			updateDragging(e.clientX, e.clientY);
		}
		lastMouseX = e.clientX;
		lastMouseY = e.clientY;
	};
	const onMouseDown = (e) => {
		if (!inputEnabled) return;
		startDragging(e.clientX, e.clientY);
		e.preventDefault();
	};
	const onMouseUp = (e) => {
		if (!inputEnabled) return;
		if (stopDragging()) {
			e.stopPropagation();
		}
	};
	const onMouseEnter = (e) => {
		if (!inputEnabled) return;
		// console.log('onMouseEnter', e);
	};
	const onMouseLeave = (e) => {
		if (!inputEnabled) return;
		stopDragging();
	};
	const onWheel = (e) => {
		if (!inputEnabled) return;
		const scaleDelta = e.deltaX + e.deltaY + e.deltaZ;
		zoomCamera(scaleDelta, lastMouseX, lastMouseY);
	};
</script>

<div
	class="interactive-surface"
	style="width: {width}px; height: {height}px;"
	on:mousemove={onMouseMove}
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	on:mouseenter={onMouseEnter}
	on:mouseleave={onMouseLeave}
	on:wheel={onWheel}
>
	<slot />
</div>

<style>
	.interactive-surface {
		user-select: none;
	}
</style>
