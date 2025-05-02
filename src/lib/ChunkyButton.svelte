<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		pressed?: boolean | undefined;
		type?: 'button' | 'submit' | 'reset' | null | undefined; // avoid submit behavior in forms
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { pressed = undefined, type = 'button', children, ...rest }: Props = $props();
</script>

<button class:pressed aria-pressed={pressed} onclick={bubble('click')} {...rest} {type}>
	{@render children?.()}
</button>

<style>
	button {
		font-size: var(--size_xl4);
		font-weight: 300;
		background-color: var(--color_a_9);
		color: var(--ocean_text_color); /* TODO customize? */
		border-color: var(--ocean_color); /* TODO customize? */
		border-style: var(--clickable_border_style);
		border-radius: 10px;
		border-width: 5px;
		padding: var(--spacing-3) var(--spacing-5);
		margin: 30px auto 40px;
		text-shadow: var(--text_shadow_sm);
	}
	/* TODO a11y hostile, keyboards too :| --- see `button:focus` in main.css */
	button:hover {
		border-style: var(--clickable_border_style_hover);
	}
	button:active,
	.pressed {
		background-color: var(--color_a_9);
		border-style: var(--clickable_border_style_active);
	}
</style>
