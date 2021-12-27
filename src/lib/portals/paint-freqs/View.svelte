<script lang="ts">
	import PaintFreqs from './PaintFreqs.svelte';

	export const portal = undefined;
	export let width: number;
	export let height: number;
</script>

<PaintFreqs {width} {height} />
