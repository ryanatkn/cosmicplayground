<script lang="ts">
	import {swallow} from '@feltjs/util/dom.js';

	// TODO merge with `@feltcoop/dealt/Surface.svelte`
	// TODO maybe pass camera, but some components would need refactoring
	export let width: number;
	export let height: number;
	export let scale: number;
	export let zoomCamera: (
		zoomDirection: number,
		screenPivotX: number,
		screenPivotY: number,
		multipler?: number,
	) => void;
	export let moveCamera: (dx: number, dy: number) => void;
	export let inputEnabled = true;

	// TODO dispatch events (instead or in addition to binding?)
	// exported for binding
	export let pointerDown = false;
	export let pointerX: number | null = null;
	export let pointerY: number | null = null;

	let el: HTMLDivElement;

	const events = new Map<number, PointerEvent>();
	let last_pinch_distance: number | null = null;
	const POINTER_ZOOM_SENSITIVITY = 1.002; // multiplier for the pointer delta

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
		zoomCamera(scaleDelta, pointerX, pointerY); // TODO handle sensitivity
	};

	const pointerdown = (e: PointerEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		events.set(e.pointerId, e);
		if (e.isPrimary) {
			if (events.size === 1) {
				updatePointerPosition(e.clientX, e.clientY);
				pointerDown = true; // only set to `true` when there's 1 event, but setting to `false` occurs no matter what, because other pointers may have gone down
			}
		}
	};
	const pointerup = (e: PointerEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		events.delete(e.pointerId);
		if (e.isPrimary) {
			if (events.size === 1) {
				updatePointerPosition(e.clientX, e.clientY);
			}
			pointerDown = false;
		}
		// stop the jank that happens when releasing one finger after pinch-to-zoom
		last_pinch_distance = null;
		pointerX = null;
		pointerY = null;
	};
	const pointerleave = (e: PointerEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		events.delete(e.pointerId);
		if (e.isPrimary) {
			if (events.size === 1) {
				updatePointerPosition(e.clientX, e.clientY);
			}
			pointerDown = false;
			last_pinch_distance = null;
			pointerX = null;
			pointerY = null;
		}
	};
	const pointermove = (e: PointerEvent) => {
		if (!inputEnabled) return;
		swallow(e);
		events.set(e.pointerId, e);
		// when 2 pointers are down, handle pinch-to-zoom gestures
		const eventCount = events.size;
		if (eventCount === 1) {
			updatePointerPosition(e.clientX, e.clientY);
		} else if (eventCount === 2) {
			const es = Array.from(events.values());
			const x1 = es[0].clientX;
			const y1 = es[0].clientY;
			const x2 = es[1].clientX;
			const y2 = es[1].clientY;
			const distance = Math.hypot(x2 - x1, y2 - y1);
			if (last_pinch_distance !== null) {
				const delta = last_pinch_distance - distance;
				const magnitude = Math.abs(delta / 0.33); // magic number for per-event deltas
				const sensitivity = magnitude * (POINTER_ZOOM_SENSITIVITY - 1) + 1; // TODO super hacky
				zoomCamera(delta, (x1 + x2) / 2, (y1 + y2) / 2, sensitivity); // TODO is weird that `delta` is only for direction, see the API, merge with `sensitivity` probably
			}
			last_pinch_distance = distance;
		}
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
	on:pointerout={pointerleave}
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
