<script lang="ts">
	import AppTESTChild1 from './AppTESTChild1.svelte';
	import AppTESTChild2 from './AppTESTChild2.svelte';
	const a = 'astr';
</script>

<AppTESTChild1 {a} childOneNum={1} childOneStr="y">
	<AppTESTChild2 childTwoNum={'2'}>
		<AppTESTChild2 childTwoNum={'2'} />
	</AppTESTChild2>
</AppTESTChild1>
