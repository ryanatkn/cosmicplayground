<script lang="ts">
	interface Props {
		elapsedTime: number;
		style?: string | null;
		lowestHzValue?: number; // the base cycle should be a multiple of this
		lowestHzItemCount?: number; // value range: [1, N] where N is an integer - the # of items that will appear for the lowest hz value
		height?: number;
		width?: number;
		hzItems?: number[]; // correspond to a # of hz - `baseCycleLength` needs to be evenly divisible, or we get visual bugs
	}

	let {
		elapsedTime,
		style = null,
		lowestHzValue = 1000,
		lowestHzItemCount = 4,
		height = 600,
		width = 1000,
		hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60],
	}: Props = $props();
	export const getHzItemSelectedIndices = (): number[] => hzItemSelectedIndices; // TODO better pattern?
	let baseCycleLength = $derived(lowestHzValue * lowestHzItemCount);
	let baseCycleTime = $derived(elapsedTime % baseCycleLength);
	let baseCyclePct = $derived(baseCycleTime / baseCycleLength);
	// TODO are there any low-hanging high-impact optimizations here? maybe not re-allocating arrays each tick?
	let hzItemCounts = $derived(hzItems.map((v) => (v * baseCycleLength) / 1000));
	let hzItemSelectedIndices = $derived(hzItemCounts.map((v) => Math.floor(baseCyclePct * v)));
	let hzItemHeight = $derived(height / hzItems.length);
	let hzItemWidths = $derived(hzItems.map((_v, i) => width / hzItemCounts[i]));
</script>

<svg {width} {height} {style}>
	{#each hzItems as hzItem, i (hzItem)}
		<g style:opacity={0.5 + (0.5 * i) / hzItems.length}>
			{#each {length: hzItemCounts[i]} as _, j}
				{#if hzItemSelectedIndices[i] === j}
					<rect
						x={j * hzItemWidths[i]}
						y={i * hzItemHeight}
						width={hzItemWidths[i]}
						height={hzItemHeight}
						fill="hsl({35 + 360 * (j / hzItem)}, {j % 2 ? '25%' : '30%'}, {j % 2 ? '30%' : '28%'})"
					/>
				{/if}
			{/each}
		</g>
	{/each}
</svg>
