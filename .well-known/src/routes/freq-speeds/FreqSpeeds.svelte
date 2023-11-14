<script lang="ts">
	export let elapsedTime: number;
	export let style: string | null = null;
	export let lowestHzValue = 1000; // the half cycle should be a multiple of this
	export let lowestHzItemCount = 2; // value range: [1, N] where N is an integer - the # of items that will appear for the lowest hz value
	$: halfCycleLength = lowestHzValue * lowestHzItemCount;
	$: halfCycleTime = elapsedTime % halfCycleLength;
	$: halfCyclePct = halfCycleTime / halfCycleLength;
	$: fullCycleLength = 2 * halfCycleLength;
	$: fullCycleTime = elapsedTime % fullCycleLength;
	$: fullCyclePct = fullCycleTime / fullCycleLength;
	$: cycleReversing = fullCyclePct > 0.5;
	$: relativeCyclePct = cycleReversing ? 1 - halfCyclePct : halfCyclePct;
	export let height = 600;
	export let width = 1000;
	export let hzItems: number[] = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]; // correspond to a # of hz - `halfCycleLength` needs to be evenly divisible, or we get visual bugs
	// TODO are there any low-hanging high-impact optimizations here? maybe not re-allocating arrays each tick?
	$: hzItemCounts = hzItems.map((v) => (v * halfCycleLength) / 1000);
	$: hzItemSelectedIndices = hzItemCounts.map((v) => Math.floor(relativeCyclePct * v));
	$: hzItemHeight = height / hzItems.length;
	$: hzItemWidths = hzItems.map((_v, i) => width / hzItemCounts[i]);
	export const getHzItemSelectedIndices = (): number[] => hzItemSelectedIndices; // TODO better pattern?
</script>

<svg {width} {height} {style}>
	<g>
		{#each hzItems as hzItem, i (hzItem)}
			<g style="opacity: {0.5 + (0.5 * i) / hzItems.length}">
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
	</g>
</svg>
