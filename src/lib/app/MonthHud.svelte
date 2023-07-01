<script lang="ts">
	export let active_land_index: number | null; // active is the hover state or "current" when automatically cycling
	export let selected_land_index: number | null; // selected is the "current" non-cycling state (confusing yes)
	export let select_land_index: (value: number | null) => void;
	export let hover_land_index: (value: number | null) => void;

	const toggle_index = (index: number) => {
		select_land_index(selected_land_index === index ? null : index);
	};
</script>

<div class="month-hud">
	{#each {length: 12} as _, i}
		<button
			class:active={i === active_land_index}
			class:selected={i === selected_land_index}
			aria-label="select month {i + 1}"
			on:click={() => toggle_index(i)}
			on:mouseenter={() => hover_land_index(i)}
			on:mouseleave={() => hover_land_index(null)}
		>
			∙
		</button>
	{/each}
</div>

<style>
	.month-hud {
		width: 100%;
		display: flex;
		-webkit-user-select: none;
		user-select: none;
	}
	button {
		height: var(--hud_element_size);
		font-size: var(--font_size_xl4);
		flex: 1;
		transition: opacity 0.15s linear;
		text-shadow: var(--text_shadow_sm);
		opacity: 0.4;
		border: none;
	}
	button.active {
		opacity: 1;
		transition-duration: 0s;
		text-shadow: var(--text_shadow_sm);
	}
	button:active {
		opacity: 0.7;
		text-shadow: var(--text_shadow_reverse_sm);
	}
	button.selected,
	button.active:active {
		text-shadow: var(--text_shadow_reverse_sm);
	}
	button.selected:active {
		text-shadow: var(--text_shadow_sm);
	}
</style>
