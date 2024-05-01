<script lang="ts">
	export let sea_level: number;
	export let sea_index_max: number;
	export let selected_sea_level: number | null;
	export let select_sea_level: (value: number | null) => void;
	export let hover_sea_level: (value: number | null) => void;

	// TODO style when selected

	let water_level_el: HTMLElement;

	const get_sea_level = (y: number): number => {
		const rect = water_level_el.getBoundingClientRect();
		const value = (1 - (y - rect.top) / (rect.bottom - rect.top)) * sea_index_max;
		return value;
	};
</script>

<div
	class="water-level"
	bind:this={water_level_el}
	class:selected={selected_sea_level !== null}
	on:click={(e) => select_sea_level(selected_sea_level === null ? get_sea_level(e.clientY) : null)}
	aria-hidden="true"
	on:mouseenter={(e) => hover_sea_level(get_sea_level(e.clientY))}
	on:mousemove={(e) => hover_sea_level(get_sea_level(e.clientY))}
	on:mouseleave={() => hover_sea_level(null)}
>
	<div class="water-level-fill" style="height: {(100 * sea_level) / sea_index_max}%;" />
</div>

<style>
	.water-level {
		/* TODO make this not fixed */
		position: fixed;
		top: var(--hud_element_size);
		right: 0;
		width: var(--hud_element_size);
		height: calc(100% - 2 * var(--hud_element_size));
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		cursor: pointer;
	}
	.water-level-fill {
		width: 7px;
		background-color: var(--ocean_color);
		position: absolute;
		opacity: 0.65;
		box-shadow:
			1px 0 2px 1px #000,
			2px 0 7px #000;
	}
	.selected .water-level-fill {
		box-shadow:
			-1px 0 2px 1px var(--ocean_text_color),
			-2px 0 7px #000;
	}
	.water-level:active .water-level-fill {
		opacity: 1;
	}
</style>
