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
		multiplier?: number,
	) => void;
	export let moveCamera: (dx: number, dy: number) => void;
	export let inputEnabled = true;

	let debugArgs: Array<{
		zoomDirection: number;
		multiplier?: number;
		x1: number;
		x2: number;
		y1: number;
		y2: number;
		magnitude: number;
	}> = [];

	const debugZoomCamera: (
		zoomDirection: number,
		screenPivotX: number,
		screenPivotY: number,
		magnitude: number,
		multiplier?: number,
	) => void = (zoomDirection, screenPivotX, screenPivotY, magnitude, multiplier) => {
		zoomCamera(zoomDirection, screenPivotX, screenPivotY, multiplier);
		const nextDebugArgs = debugArgs.slice(-20);
		const es = Array.from(events.values());
		const x1 = es[0]?.clientX;
		const y1 = es[0]?.clientY;
		const x2 = es[1]?.clientX;
		const y2 = es[1]?.clientY;
		nextDebugArgs.push({zoomDirection, multiplier, x1, x2, y1, y2, magnitude});
		debugArgs = nextDebugArgs;
	};

	// TODO probably refactor these, written before `events` was added for pinch gestures
	let pointerDown = false;
	let pointerX: number | null = null;
	let pointerY: number | null = null;

	let el: HTMLDivElement;

	const events = new Map<number, PointerEvent>();
	let last_pinch_distance: number | null = null;
	const POINTER_ZOOM_SENSITIVITY = 1.002; // multiplier for the pointer delta

	const toPointerPosition = (clientX: number, clientY: number, el: HTMLElement) => {
		// TODO correctly handle when the DOM element itself is scaled -- maybe the existing `scale` should be `zoom` and this is `scale`?
		const rect = el.getBoundingClientRect();
		const x = clientX - rect.left; //  / domElementScale;
		const y = clientY - rect.top; // / domElementScale;
		return {x, y};
	};

	const pan = (clientX: number, clientY: number): void => {
		if (pointerX !== null && pointerY !== null) {
			const dx = pointerX - clientX;
			const dy = pointerY - clientY;
			moveCamera(dx / scale, dy / scale);
		}
		const p = toPointerPosition(clientX, clientY, el);
		pointerX = p.x;
		pointerY = p.y;
	};

	const wheel = (e: WheelEvent) => {
		const {x, y} = toPointerPosition(e.clientX, e.clientY, el);
		const scaleDelta = e.deltaX + e.deltaY + e.deltaZ;
		debugZoomCamera(scaleDelta, x, y, 0); // TODO handle sensitivity
	};

	const pointerdown = (e: PointerEvent) => {
		swallow(e);
		events.set(e.pointerId, e);
		pointerX = null;
		pointerY = null;
		last_pinch_distance = null;
		if (e.isPrimary) {
			if (events.size === 1) {
				pointerDown = true;
				pan(e.clientX, e.clientY);
			}
		}
	};
	const pointerup = (e: PointerEvent) => {
		swallow(e);
		events.delete(e.pointerId);
		pointerX = null;
		pointerY = null;
		last_pinch_distance = null;
		if (e.isPrimary) {
			pointerDown = false;
		}
	};
	const pointermove = (e: PointerEvent) => {
		swallow(e);
		if (!events.has(e.pointerId)) throw Error(); // TODO delete this line
		events.set(e.pointerId, e);
		// when 2 pointers are down, handle pinch-to-zoom gestures
		const eventCount = events.size;
		if (eventCount === 1) {
			if (pointerDown) {
				pan(e.clientX, e.clientY);
			}
		} else if (eventCount === 2) {
			const es = Array.from(events.values());
			const x1 = es[0].clientX;
			const y1 = es[0].clientY;
			const x2 = es[1].clientX;
			const y2 = es[1].clientY;
			const distance = Math.hypot(x2 - x1, y2 - y1);
			if (last_pinch_distance !== null) {
				const count = e.getCoalescedEvents().length;
				const delta = last_pinch_distance - distance;
				const magnitude = Math.abs(delta / 0.33); // magic number for per-event deltas
				const sensitivity = magnitude * (POINTER_ZOOM_SENSITIVITY - 1) + 1; // TODO super hacky
				debugZoomCamera(delta, (x1 + x2) / 2, (y1 + y2) / 2, count, sensitivity); // TODO is weird that `delta` is only for direction, see the API, merge with `sensitivity` probably
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
	on:wheel|passive={inputEnabled ? wheel : undefined}
	on:pointerdown={inputEnabled ? pointerdown : undefined}
	on:pointermove={inputEnabled ? pointermove : undefined}
	on:pointerup={inputEnabled ? pointerup : undefined}
	on:pointerleave={inputEnabled ? pointerup : undefined}
	on:pointercancel={inputEnabled ? pointerup : undefined}
	on:pointerout={inputEnabled ? pointerup : undefined}
	on:touchstart|nonpassive={inputEnabled ? swallow : undefined}
	on:touchmove|nonpassive={inputEnabled ? swallow : undefined}
>
	<slot />
	<div class="debugging">
		<table>
			{#each debugArgs as a}
				<tr>
					<td>{a.zoomDirection.toFixed(1)}</td>
					<td>{a.multiplier?.toFixed(3) ?? ''}</td>
					<td>{a.x1}, {a.y1}</td>
					<td>{a.x2}, {a.y2}</td>
					<td>{a.magnitude}</td>
				</tr>
			{/each}
		</table>
	</div>
</div>

<style>
	.surface {
		-webkit-user-select: none;
		user-select: none;
		touch-action: none;
	}
	.debugging {
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		user-select: none;
		font-size: var(--font_size_sm);
		white-space: nowrap;
	}
	tr {
		height: 17px;
	}
	td {
		padding: 0 var(--spacing_xs);
	}
</style>
