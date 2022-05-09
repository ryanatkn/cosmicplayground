<script lang="ts">
	type TItem = $$Generic;

	export let selectedIndex: number;
	export let items: TItem[];
</script>

{#each items as item, index (item || Symbol())}
	<slot {item} selected={index === selectedIndex} {index} />
{/each}
