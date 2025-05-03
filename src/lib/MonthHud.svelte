<script lang="ts">
	interface Props {
		active_land_index: number | null; // active is the hover state or "current" when automatically cycling
		selected_land_index: number | null; // selected is the "current" non-cycling state (confusing yes)
		select_land_index: (value: number | null) => void;
		hover_land_index: (value: number | null) => void;
	}

	const {active_land_index, selected_land_index, select_land_index, hover_land_index}: Props =
		$props();

	const toggle_index = (index: number) => {
		select_land_index(selected_land_index === index ? null : index);
	};
</script>

<div class="month-hud">
	{#each {length: 12} as _, i (i)}
		<button
			type="button"
			class:active={i === active_land_index}
			class:selected={i === selected_land_index}
			aria-label="select month {i + 1}"
			onclick={() => toggle_index(i)}
			onmouseenter={() => hover_land_index(i)}
			onmouseleave={() => hover_land_index(null)}
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
