<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';

	// TODO probably merge with $lib/Surface.svelte

	export let width: number;
	export let height: number;
	export let scale: number;
	export let zoom: (
		direction: number,
		pivot_x: number,
		pivot_y: number,
		multiplier?: number,
	) => void;
	export let pan: (dx: number, dy: number) => void;
	export let disabled = false;

	// TODO probably refactor these, written before `events` was added for pinch gestures
	let pointer_down = false;
	let pointer_x: number | null = null;
	let pointer_y: number | null = null;

	let el: HTMLDivElement;

	const events = new Map<number, PointerEvent>();
	let last_pinch_distance: number | null = null;
	const POINTER_ZOOM_SENSITIVITY = 1.002; // multiplier for the pointer delta

	const to_pointer_position = (clientX: number, clientY: number, el: HTMLElement) => {
		// TODO correctly handle when the DOM element itself is scaled -- maybe the existing `scale` should be `zoom` and this is `scale`?
		const rect = el.getBoundingClientRect();
		const x = clientX - rect.left; //  / domElementScale;
		const y = clientY - rect.top; // / domElementScale;
		return {x, y};
	};

	const pan_to = (clientX: number, clientY: number): void => {
		if (pointer_x !== null && pointer_y !== null) {
			const dx = pointer_x - clientX;
			const dy = pointer_y - clientY;
			pan(dx / scale, dy / scale);
		}
		const p = to_pointer_position(clientX, clientY, el);
		pointer_x = p.x;
		pointer_y = p.y;
	};

	const wheel = (e: WheelEvent) => {
		const {x, y} = to_pointer_position(e.clientX, e.clientY, el);
		const scaleDelta = e.deltaX + e.deltaY + e.deltaZ;
		zoom(scaleDelta, x, y);
	};

	const pointerdown = (e: PointerEvent) => {
		swallow(e);
		events.set(e.pointerId, e);
		pointer_x = null;
		pointer_y = null;
		last_pinch_distance = null;
		if (e.isPrimary) {
			if (events.size === 1) {
				pointer_down = true;
				pan_to(e.clientX, e.clientY);
			}
		}
	};
	const pointerup = (e: PointerEvent) => {
		swallow(e);
		events.delete(e.pointerId);
		pointer_x = null;
		pointer_y = null;
		last_pinch_distance = null;
		if (e.isPrimary) {
			pointer_down = false;
		}
	};
	const pointermove = (e: PointerEvent) => {
		swallow(e);
		events.set(e.pointerId, e);
		// when 2 pointers are down, handle pinch-to-zoom gestures
		const event_count = events.size;
		if (event_count === 1) {
			if (pointer_down) {
				pan_to(e.clientX, e.clientY);
			}
		} else if (event_count === 2) {
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
				zoom(delta, (x1 + x2) / 2, (y1 + y2) / 2, sensitivity); // TODO is weird that `delta` is only for direction, see the API, merge with `sensitivity` probably
			}
			last_pinch_distance = distance;
		}
	};
</script>

<div
	bind:this={el}
	class="surface"
	style:width="{width}px"
	style:height="{height}px"
	on:wheel|passive={disabled ? undefined : wheel}
	on:pointerdown={disabled ? undefined : pointerdown}
	on:pointermove={disabled ? undefined : pointermove}
	on:pointerup={disabled ? undefined : pointerup}
	on:pointerleave={disabled ? undefined : pointerup}
	on:pointercancel={disabled ? undefined : pointerup}
	on:pointerout={disabled ? undefined : pointerup}
	on:touchstart|nonpassive={disabled ? undefined : swallow}
	on:touchmove|nonpassive={disabled ? undefined : swallow}
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
