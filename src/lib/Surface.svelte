<script lang="ts">
	import {swallow} from '@grogarden/util/dom.js';

	// TODO maybe don't cancel when leaving the screen

	// TODO probably add events
	export let scale = 1; // makes the pointer position calculations transform-scale-aware
	export let pointing: boolean | undefined = undefined;
	export let pointer_down: boolean | undefined = undefined;
	export let pointer_x: number | undefined = undefined;
	export let pointer_y: number | undefined = undefined;
	export let cancel_on_leave = true;

	const update_pointer_position = (clientX: number, clientY: number): void => {
		const rect = el.getBoundingClientRect();
		pointer_x = (clientX - rect.left) / scale;
		pointer_y = (clientY - rect.top) / scale;
	};

	const pointerdown = (e: PointerEvent & {currentTarget: EventTarget & HTMLDivElement}) => {
		if (e.shiftKey || e.button >= 3) return; // TODO how else to avoid breaking mouse back button on Chrome? doesn't happen on Firefox
		swallow(e);
		update_pointer_position(e.clientX, e.clientY);
		pointer_down = true;
		focus();
	};
	const pointerup = (e: PointerEvent & {currentTarget: EventTarget & HTMLDivElement}) => {
		if (e.shiftKey || e.button >= 3) return; // TODO how else to avoid breaking mouse back button on Chrome? doesn't happen on Firefox
		swallow(e);
		update_pointer_position(e.clientX, e.clientY);
		pointer_down = false;
	};
	const pointermove = (e: PointerEvent & {currentTarget: EventTarget & HTMLDivElement}) => {
		if (e.shiftKey) return;
		swallow(e);
		update_pointer_position(e.clientX, e.clientY);
	};
	const pointerenter = (e: PointerEvent & {currentTarget: EventTarget & HTMLDivElement}) => {
		if (e.shiftKey) return;
		swallow(e);
		update_pointer_position(e.clientX, e.clientY);
		pointing = true;
	};
	const pointerleave = (e: PointerEvent & {currentTarget: EventTarget & HTMLDivElement}) => {
		if (e.shiftKey) return;
		swallow(e);
		update_pointer_position(e.clientX, e.clientY);
		pointing = false;
		if (cancel_on_leave && pointer_down) {
			pointer_down = false;
			unfocus();
		}
	};
	const pointercancel = (e: PointerEvent & {currentTarget: EventTarget & HTMLDivElement}) => {
		if (e.shiftKey) return;
		swallow(e);
		if (pointer_down) {
			pointer_down = false;
			unfocus();
		}
	};

	let el: HTMLDivElement;

	const focus = (): void => {
		if (document.activeElement !== el) {
			el.focus();
		}
	};
	const unfocus = (): void => {
		if (document.activeElement === el) {
			el.blur();
		}
	};
</script>

<div
	class="surface"
	tabindex="0"
	role="button"
	bind:this={el}
	on:pointerdown={pointerdown}
	on:pointerup={pointerup}
	on:pointermove={pointermove}
	on:pointerenter={pointerenter}
	on:pointerleave={pointerleave}
	on:pointercancel={pointercancel}
>
	<slot />
</div>

<style>
	.surface {
		position: relative;
		width: var(--width, 100%);
		height: var(--height, 100%);
		-webkit-user-select: none;
		user-select: none;
		touch-action: none;
	}
</style>
