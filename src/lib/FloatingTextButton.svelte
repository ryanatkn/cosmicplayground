<script lang="ts">
	export let pressed: boolean | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button'; // avoid submit behavior in forms
	export let classes: string | null = null; // TODO not sure about this pattern, not used atm
</script>

<button class={classes} {type} class:pressed aria-pressed={pressed} on:click {...$$restProps}>
	<slot />
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
