<button type="button" on:click {...$$restProps}>
	<slot />
</button>

<style>
	button {
		cursor: pointer;
		height: auto;
		transition: var(--clickable_transition);
		transform-origin: center;
		transform: var(--clickable_transform);
		border: none;
		display: inline-block;
	}
	button:hover {
		transform: var(--clickable_transform__hover);
	}
	button:active {
		transform: var(--clickable_transform__active);
	}
</style>
