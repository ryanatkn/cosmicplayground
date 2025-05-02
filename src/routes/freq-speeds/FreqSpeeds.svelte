<script lang="ts">
	interface Props {
		elapsedTime: number;
		style?: string | null;
		lowestHzValue?: number; // the half cycle should be a multiple of this
		lowestHzItemCount?: number; // value range: [1, N] where N is an integer - the # of items that will appear for the lowest hz value
		height?: number;
		width?: number;
		hzItems?: number[]; // correspond to a # of hz - `halfCycleLength` needs to be evenly divisible, or we get visual bugs
	}

	let {
		elapsedTime,
		style = null,
		lowestHzValue = 1000,
		lowestHzItemCount = 2,
		height = 600,
		width = 1000,
		hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60],
	}: Props = $props();
	export const getHzItemSelectedIndices = (): number[] => hzItemSelectedIndices; // TODO better pattern?
	let halfCycleLength = $derived(lowestHzValue * lowestHzItemCount);
	let halfCycleTime = $derived(elapsedTime % halfCycleLength);
	let halfCyclePct = $derived(halfCycleTime / halfCycleLength);
	let fullCycleLength = $derived(2 * halfCycleLength);
	let fullCycleTime = $derived(elapsedTime % fullCycleLength);
	let fullCyclePct = $derived(fullCycleTime / fullCycleLength);
	let cycleReversing = $derived(fullCyclePct > 0.5);
	let relativeCyclePct = $derived(cycleReversing ? 1 - halfCyclePct : halfCyclePct);
	// TODO are there any low-hanging high-impact optimizations here? maybe not re-allocating arrays each tick?
	let hzItemCounts = $derived(hzItems.map((v) => (v * halfCycleLength) / 1000));
	let hzItemSelectedIndices = $derived(hzItemCounts.map((v) => Math.floor(relativeCyclePct * v)));
	let hzItemHeight = $derived(height / hzItems.length);
	let hzItemWidths = $derived(hzItems.map((_v, i) => width / hzItemCounts[i]));
</script>

<svg {width} {height} {style}>
	{#each hzItems as hzItem, i (hzItem)}
		<g style:opacity={0.5 + (0.5 * i) / hzItems.length}>
			{#each {length: hzItemCounts[i]} as _, j}
				<rect
					x={j * hzItemWidths[i]}
					y={i * hzItemHeight}
					width={hzItemWidths[i]}
					height={hzItemHeight}
					fill="hsl({35 + 360 * (j / hzItem)}, {j % 2 ? '25%' : '30%'}, {hzItemSelectedIndices[
						i
					] === j
						? '50%'
						: j % 2
							? '20%'
							: '18%'})"
				/>
			{/each}
		</g>
	{/each}
</svg>
