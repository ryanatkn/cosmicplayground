<script lang="ts">
	export let pressed: boolean | undefined = undefined;
	export let type = 'button'; // avoid submit behavior in forms
	export let classes: string | null = null; // TODO not sure about this pattern, not used atm
	export let style: string | null = null; // TODO not sure about this pattern, not used atm
</script>

<button class={classes} {type} class:pressed aria-pressed={pressed} on:click {style}>
	<slot />
</button>

<style>
	button {
		height: var(--hud_element_size);
		font-size: var(--font_size_lg);
		font-weight: 300;
		text-shadow: var(--text_shadow_sm);
		white-space: nowrap;
		transition: var(--clickable_transition);
		opacity: var(--clickable_opacity);
		transform-origin: center;
		transform: var(--clickable_transform);
		border: none;
		padding: 0 var(--spacing-7);
	}
	/* TODO a11y hostile, keyboards too :| --- see `button:focus` in main.css */
	button:hover {
		transform: var(--clickable_transform__hover);
		opacity: var(--clickable_opacity__hover);
	}
	/* TODO different styling for pressed? */
	button:active,
	.pressed {
		transform: var(--clickable_transform__active);
		opacity: var(--clickable_opacity__active);
		text-shadow: var(--text_shadow_reverse_sm);
	}
</style>
