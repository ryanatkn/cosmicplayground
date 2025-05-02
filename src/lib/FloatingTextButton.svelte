<script lang="ts">
	import {createBubbler} from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		pressed?: boolean | undefined;
		type?: 'button' | 'submit' | 'reset' | null | undefined; // avoid submit behavior in forms
		classes?: string | null; // TODO not sure about this pattern, not used atm
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {pressed = undefined, type = 'button', classes = null, children, ...rest}: Props = $props();
</script>

<button
	class={classes}
	{type}
	class:pressed
	aria-pressed={pressed}
	onclick={bubble('click')}
	{...rest}
>
	{@render children?.()}
</button>

<style>
	button {
		height: var(--hud_element_size);
		font-size: var(--size_xl2);
		line-height: 1;
		font-weight: 300;
		text-shadow: var(--text_shadow_sm);
		white-space: nowrap;
		transition: var(--clickable_transition);
		opacity: var(--clickable_opacity);
		transform-origin: center;
		transform: var(--clickable_transform);
		border: none;
		padding: 0 var(--spacing-7);
		color: hsl(0 0% 80%);
	}
	/* TODO a11y hostile, keyboards too :| --- see `button:focus` in main.css */
	button:hover {
		transform: var(--clickable_transform_hover);
		opacity: var(--clickable_opacity_hover);
	}
	/* TODO different styling for pressed? */
	button:active,
	.pressed {
		transform: var(--clickable_transform_active);
		opacity: var(--clickable_opacity_active);
		text-shadow: var(--text_shadow_reverse_sm);
	}
</style>
