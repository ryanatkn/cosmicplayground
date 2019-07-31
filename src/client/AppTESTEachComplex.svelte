<script lang="ts">
	import AppTESTChild1 from './AppTESTChild1.svelte';
	export let name: string | undefined;
	const items = {foo: [{id: '1'}, {id: '2'}]};
</script>

{#each items as item, idx (item.id)}
	<AppTESTChild1 childOneNum={1} childOneStr="y" childOneStrTwo="y" />
	<AppTESTChild1 childOneNum={idx} childOneStr={item.id} />
{/each}
