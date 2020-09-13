<script>
	export let pressed = undefined;
	export let type = 'button'; // avoid submit behavior in forms
	export let classes = null; // TODO not sure about this pattern, not used atm
	export let style = null; // TODO not sure about this pattern, not used atm
</script>

<button class={classes} {type} class:pressed aria-pressed={pressed} on:click {style}>
	<slot />
</button>

<style>
	button {
		font-size: var(--font_size_lg);
		font-weight: 300;
		background: var(--bg_1);
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
		border-style: var(--clickable_border_style__hover);
	}
	button:active,
	.pressed {
		border-style: var(--clickable_border_style__active);
	}
</style>
