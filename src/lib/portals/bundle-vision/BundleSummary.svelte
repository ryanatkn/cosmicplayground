<script lang="ts">
	import BundleChunkSummary from './BundleChunkSummary.svelte';

	export let stats;
	export const statsStr = undefined;
</script>

<div class="p-5">
	<!-- TODO consider flattening the data structure and adding a type=chunk|asset property -->
	{#each stats.chunks as chunk (chunk.fileName)}
		<BundleChunkSummary {chunk} />
	{/each}
</div>
