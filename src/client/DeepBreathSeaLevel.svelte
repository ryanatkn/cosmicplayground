<script>
	export let seaLevel;
	export let seaIndexMax;
	export let selectedSeaLevel;
	export let selectSeaLevel;
	export let hoverSeaLevel;

	let waterLevelEl;

	const getSeaLevel = (y) => {
		const rect = waterLevelEl.getBoundingClientRect();
		const height = rect.bottom - rect.top;
		const value = (1 - y / height) * seaIndexMax;
		return value;
	};
</script>

<div
	class="water-level"
	bind:this={waterLevelEl}
	on:click={(e) => selectSeaLevel(selectedSeaLevel === null ? getSeaLevel(e.clientY) : null)}
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
		top: 0;
		right: 0;
		width: var(--hud-column-width);
		height: calc(100% - var(--hud-column-width)); /* TODO */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}
	.water-level-fill {
		width: 7px;
		background-color: var(--ocean_color);
		position: absolute;
		opacity: 0.6;
		box-shadow: 1px 0 2px 1px #000, 2px 0 7px #000;
	}
</style>
