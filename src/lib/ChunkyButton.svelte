<script lang="ts">
	export let pressed: boolean | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button'; // avoid submit behavior in forms
</script>

<button class:pressed aria-pressed={pressed} on:click {...$$restProps} {type}>
	<slot />
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
