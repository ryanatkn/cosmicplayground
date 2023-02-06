<script lang="ts">
	export let elapsedTime: number;
	export let style: string | null = null;
	export let lowestHzValue = 1000; // the base cycle should be a multiple of this
	export let lowestHzItemCount = 4; // value range: [1, N] where N is an integer - the # of items that will appear for the lowest hz value
	$: baseCycleLength = lowestHzValue * lowestHzItemCount;
	$: baseCycleTime = elapsedTime % baseCycleLength;
	$: baseCyclePct = baseCycleTime / baseCycleLength;
	export let height = 600;
	export let width = 1000;
	export let hzItems: number[] = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]; // correspond to a # of hz - `baseCycleLength` needs to be evenly divisible, or we get visual bugs
	// TODO are there any low-hanging high-impact optimizations here? maybe not re-allocating arrays each tick?
	$: hzItemCounts = hzItems.map((v) => (v * baseCycleLength) / 1000);
	$: hzItemSelectedIndices = hzItemCounts.map((v) => Math.floor(baseCyclePct * v));
	$: hzItemHeight = height / hzItems.length;
	$: hzItemWidths = hzItems.map((_v, i) => width / hzItemCounts[i]);
	export const getHzItemSelectedIndices = (): number[] => hzItemSelectedIndices; // TODO better pattern?
</script>

<svg {width} {height} {style}>
	<g>
		{#each hzItems as hzItem, i (hzItem)}
			<g style="opacity: {0.5 + (0.5 * i) / hzItems.length}">
				{#each {length: hzItemCounts[i]} as _, j}
					{#if hzItemSelectedIndices[i] === j}
						<rect
							x={j * hzItemWidths[i]}
							y={i * hzItemHeight}
							width={hzItemWidths[i]}
							height={hzItemHeight}
							fill="hsl({35 + 360 * (j / hzItem)}, {j % 2 ? '25%' : '30%'}, {j % 2
								? '30%'
								: '28%'})"
						/>
					{/if}
				{/each}
			</g>
		{/each}
	</g>
</svg>
