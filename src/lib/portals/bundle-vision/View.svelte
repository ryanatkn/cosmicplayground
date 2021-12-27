<script>
	import BundleVision from './BundleVision.svelte';

	export const portal = undefined;
	export const width = undefined;
	export const height = undefined;
</script>

<!-- // TODO path - see `src/project/paths.ts` for more -->
<BundleVision url="/bundle.stats.json" />
