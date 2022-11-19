<script lang="ts">
	export let seaLevel: number;
	export let seaIndexMax: number;
	export let selectedSeaLevel: number | null;
	export let selectSeaLevel: (value: number | null) => void;
	export let hoverSeaLevel: (value: number | null) => void;

	// TODO style when selected

	let waterLevelEl: HTMLElement;

	const getSeaLevel = (y: number): number => {
		const rect = waterLevelEl.getBoundingClientRect();
		const value = (1 - (y - rect.top) / (rect.bottom - rect.top)) * seaIndexMax;
		return value;
	};
</script>

<div
	class="water-level"
	bind:this={waterLevelEl}
	class:selected={selectedSeaLevel !== null}
	on:click={(e) => selectSeaLevel(selectedSeaLevel === null ? getSeaLevel(e.clientY) : null)}
	aria-hidden
	on:mouseenter={(e) => hoverSeaLevel(getSeaLevel(e.clientY))}
	on:mousemove={(e) => hoverSeaLevel(getSeaLevel(e.clientY))}
	on:mouseleave={() => hoverSeaLevel(null)}
>
	<div class="water-level-fill" style="height: {(100 * seaLevel) / seaIndexMax}%;" />
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
		box-shadow: 1px 0 2px 1px #000, 2px 0 7px #000;
	}
	.selected .water-level-fill {
		box-shadow: -1px 0 2px 1px var(--ocean_text_color), -2px 0 7px #000;
	}
	.water-level:active .water-level-fill {
		opacity: 1;
	}
</style>
