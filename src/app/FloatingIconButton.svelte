<script>
	export let label; // required for a11y
	export let pressed = undefined;
	export let type = 'button'; // avoid submit behavior in forms
	export let classes = null; // TODO not sure about this pattern, not used atm
	export let style = null; // TODO not sure about this pattern, not used atm
</script>

<button class={classes} {type} aria-label={label} aria-pressed={pressed} on:click {style}>
	<slot />
</button>

<style>
	button {
		width: var(--hud_element_size);
		height: var(--hud_element_size);
		font-size: var(--font_size_xl);
		transition: var(--clickable_transition);
		opacity: var(--clickable_opacity);
		transform-origin: center;
		transform: var(--clickable_transform);
		border: none;
		padding: 0;
	}
	/* TODO a11y hostile, keyboards too :| --- see `button:focus` in main.css */
	button:hover {
		transform: var(--clickable_transform__hover);
		opacity: var(--clickable_opacity__hover);
	}
	button:active {
		transform: var(--clickable_transform__active);
		opacity: var(--clickable_opacity__active);
	}
</style>
