<script lang="ts">
	import { run } from 'svelte/legacy';

	type T = $$Generic<any>;
	interface $$Slots {
		default: {item: LayoutItem; index: number};
	}

	

	interface Props {
		// TODO this is unused
		items: T[];
		totalCount: number | undefined;
		width: number;
		height?: number;
		offset?: number;
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		items,
		totalCount,
		width,
		height = width,
		offset = 0,
		children
	}: Props = $props();

	interface LayoutItem {
		value: T;
		width: number;
		height: number;
		x: number;
		y: number;
	}

	let layout: LayoutItem[] = $state();

	const toLayout = (items: T[], total: number): LayoutItem[] =>
		items.map((value, i) => ({
			value,
			width,
			height,
			x:
				width * Math.cos(offset + Math.PI / -2 + (2 * i * Math.PI) / total + Math.PI / total) -
				width / 2,
			y:
				height * Math.sin(offset + Math.PI / -2 + (2 * i * Math.PI) / total + Math.PI / total) -
				height / 2,
		}));

	// TODO offset // radians from 12 oclock
	// TODO counterclockwide

	let total = $derived(totalCount ?? items.length);
	run(() => {
		layout = toLayout(items, total);
	});
	run(() => {
		console.log('layout', layout);
	});
</script>

{#each layout as item, index (item)}
	{@render children?.({ item, index, })}
{/each}
