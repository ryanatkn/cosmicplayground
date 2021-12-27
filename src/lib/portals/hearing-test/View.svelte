<script lang="ts">
	import HearingTest from './HearingTest.svelte';

	export const portal = undefined;
	export let width: number;
	export let height: number;
</script>

<HearingTest {width} {height} />
