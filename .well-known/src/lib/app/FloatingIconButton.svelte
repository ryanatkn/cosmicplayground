<script lang="ts">
	export let label: string; // required for a11y
	export let pressed: boolean | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button'; // avoid submit behavior in forms
	export let classes: string | null = null; // TODO not sure about this pattern, not used atm
</script>

<button class={classes} {type} aria-label={label} aria-pressed={pressed} on:click {...$$restProps}>
	<slot />
</button>

<style>
	button {
		-webkit-user-select: none;
		user-select: none;
		width: var(--hud_element_size);
		height: var(--hud_element_size);
		line-height: 1;
		font-size: var(--size, var(--size_5));
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
		transform: var(--clickable_transform__hover);
		opacity: var(--clickable_opacity__hover);
		text-decoration: none;
	}
	button:active {
		transform: var(--clickable_transform__active);
		opacity: var(--clickable_opacity__active);
		text-shadow: var(--text_shadow_reverse_sm);
	}
</style>
