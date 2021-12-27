<script lang="ts">
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

	const toLengthPct = (n) => (100 * n) / maxLength;

	// TODO this is just a quick and dirty hack
	const APP_PATH = '/home/ryan/dev/cosmicplayground/';
	const toAppPath = (path) => (path.startsWith(APP_PATH) ? path.slice(APP_PATH.length) : path);
</script>

<div>
	<h2>{chunk.fileName}</h2>
	<!-- TODO separate comoponents probably -->
	{#each chunk.modules as mod (mod.path)}
		<div class="relative w-100 h-8 flex items-center px-2">
			<div class="absolute0 w-100 h-100">
				<div
					style="background-color: rgba(80, 180, 220, 0.2); width: {toLengthPct(
						mod.originalLength,
					)}%;"
					class="absolute h-100"
				/>
				<div
					style="background-color: rgba(220, 80, 180, 0.2); width: {toLengthPct(
						mod.renderedLength,
					)}%;"
					class="absolute h-100"
				/>
			</div>
			<div class="path">{toAppPath(mod.path)}</div>
			<div>{mod.originalLength} → {mod.renderedLength}</div>
		</div>
	{/each}
</div>

<style>
	.path {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: 20px;
	}
</style>
