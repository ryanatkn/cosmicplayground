<script lang="ts">
	type TItem = $$Generic;

	interface Props {
		selectedIndex: number;
		items: TItem[];
		children?: import('svelte').Snippet<[any]>;
	}

	let { selectedIndex, items, children }: Props = $props();
</script>

{#each items as item, index (item || Symbol())}
	{@render children?.({ item, selected: index === selectedIndex, index, })}
{/each}
