<script>
  export let elapsedTime;
  export let style = null;
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
  export let hzItems = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]; // correspond to a # of hz - `halfCycleLength` needs to be evenly divisible, or we get visual bugs
  // TODO are there any low-hanging high-impact optimizations here? maybe not re-allocating things like `tickItemsActive` each tick?
  $: hzItemCounts = hzItems.map(v => (v * halfCycleLength) / 1000);
  $: hzItemActiveIndices = hzItemCounts.map(v => Math.floor(relativeCyclePct * v));
  $: hzItemHeight = height / hzItems.length;
  $: hzItemWidths = hzItems.map((v, i) => width / hzItemCounts[i]);
  $: tickItemsActive = hzItems.map((v, i) =>
    Array.from(
      {length: hzItemCounts[i]},
      (_, i2) => hzItemActiveIndices[i] === i2, // `active`
    ),
  );
</script>

<svg width={width} height={height} style={style}>
  <g>
    {#each hzItems as hzItem, i}
      <g style="opacity: {0.5 + 0.5 * i / hzItems.length}">
      {#each tickItemsActive[i] as active, j}
        <rect
          x={j * hzItemWidths[i]}
          y={i * hzItemHeight}
          width={hzItemWidths[i]}
          height={hzItemHeight}
          fill="hsl({35 + 360 * (j / tickItemsActive[i].length)}, {j % 2 ? '25%' : '30%'}, {active ? '50%' : j % 2 ? '30%' : '28%'})"
        >
        </rect>
      {/each}
      </g>
    {/each}
  </g>
</svg>
