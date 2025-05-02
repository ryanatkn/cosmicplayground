<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		label: string; // required for a11y
		pressed?: boolean | undefined;
		type?: 'button' | 'submit' | 'reset' | null | undefined; // avoid submit behavior in forms
		classes?: string | null; // TODO not sure about this pattern, not used atm
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		label,
		pressed = undefined,
		type = 'button',
		classes = null,
		children,
		...rest
	}: Props = $props();
</script>

<button class={classes} {type} aria-label={label} aria-pressed={pressed} onclick={bubble('click')} {...rest}>
	{@render children?.()}
</button>

<style>
	button {
		-webkit-user-select: none;
		user-select: none;
		width: var(--hud_element_size);
		height: var(--hud_element_size);
		line-height: 1;
		font-size: var(--size, var(--size_xl5));
		font-weight: 300;
		text-shadow: var(--text_shadow_sm);
		transition: var(--clickable_transition);
		opacity: var(--clickable_opacity);
		transform-origin: center;
		transform: var(--clickable_transform);
		border: none;
		padding: 0;
	}
	/* TODO a11y hostile, keyboards too :| --- see `button:focus` in main.css */
	button:hover {
		transform: var(--clickable_transform_hover);
		opacity: var(--clickable_opacity_hover);
		text-decoration: none;
	}
	button:active {
		transform: var(--clickable_transform_active);
		opacity: var(--clickable_opacity_active);
		text-shadow: var(--text_shadow_reverse_sm);
	}
</style>
