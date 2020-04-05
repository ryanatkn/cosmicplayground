<script>
	export let chunk;

	$: maxOriginalLengthMod = chunk.modules.reduce((max, mod) =>
		mod.originalLength > max.originalLength ? mod : max,
	);
	$: maxOriginalLength = maxOriginalLengthMod.originalLength;

	$: maxRenderedLengthMod = chunk.modules.reduce((max, mod) =>
		mod.renderedLength > max.renderedLength ? mod : max,
	);
	$: maxRenderedLength = maxRenderedLengthMod.renderedLength;

	$: maxLength = Math.max(maxOriginalLength, maxRenderedLength);

	const toLengthPct = n => (100 * n) / maxLength;
</script>

<div>
	<h2>{chunk.fileName}</h2>
	<!-- TODO separate comoponents probably -->
	{#each chunk.modules as mod (mod.path)}
		<div class="relative w-full h-8 flex items-center px-2">
			<div class="absolute0 w-full h-full">
				<div
					style="background-color: rgba(80, 180, 220, 0.2); width: {toLengthPct(mod.originalLength)}%;"
					class="absolute h-full" />
				<div
					style="background-color: rgba(220, 80, 180, 0.2); width: {toLengthPct(mod.renderedLength)}%;"
					class="absolute h-full" />
			</div>
			<div class="flex-1">{mod.path}</div>
			<div>{mod.originalLength} → {mod.renderedLength}</div>
		</div>
	{/each}
</div>
