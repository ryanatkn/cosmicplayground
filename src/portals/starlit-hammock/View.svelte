<script>
	import StarlitHammock from './StarlitHammock.svelte';

	export const portal = undefined;
	export let width;
	export let height;
</script>

<div class="view">
	<StarlitHammock {width} {height} />
</div>

<style>
	:global(.idle) .view {
		cursor: none;
	}
</style>
