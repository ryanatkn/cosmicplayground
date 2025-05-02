<script lang="ts">
	import {swallow} from '@ryanatkn/belt/dom.js';

	// TODO maybe don't cancel when leaving the screen

	interface Props {
		// TODO probably add events
		scale?: number; // makes the pointer position calculations transform-scale-aware
		pointing?: boolean | undefined;
		pointer_down?: boolean | undefined;
		pointer_x?: number | undefined;
		pointer_y?: number | undefined;
		cancel_on_leave?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		scale = 1,
		pointing = $bindable(undefined),
		pointer_down = $bindable(undefined),
		pointer_x = $bindable(undefined),
		pointer_y = $bindable(undefined),
		cancel_on_leave = true,
		children,
	}: Props = $props();

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

	let el: HTMLDivElement = $state();

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
	onpointerdown={pointerdown}
	onpointerup={pointerup}
	onpointermove={pointermove}
	onpointerenter={pointerenter}
	onpointerleave={pointerleave}
	onpointercancel={pointercancel}
>
	{@render children?.()}
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
