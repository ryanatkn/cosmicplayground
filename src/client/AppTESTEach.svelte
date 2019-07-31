<script lang="ts">
	export let name: string | undefined;
	const items = [{id: '1'}, {id: '2'}];
</script>

{#each items as item, i (item.id)}{item.id}{/each}
