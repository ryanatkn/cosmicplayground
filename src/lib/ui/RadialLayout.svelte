<script lang="ts">
	type T = $$Generic<any>;
	interface $$Slots {
		default: {item: LayoutItem; index: number};
	}

	export let items: T[];
	export let totalCount: number | undefined;
	export let width: number;
	export let height: number = width;
	// TODO offset // radians from 12 oclock
	// TODO counterclockwide

	$: total = totalCount ?? items.length;

	interface LayoutItem {
		value: T;
		width: number;
		height: number;
		x: number;
		y: number;
	}

	let layout: LayoutItem[];
	$: layout = toLayout(items, total);

	const toLayout = (items: T[], total: number): LayoutItem[] =>
		items.map((value, i) => ({
			value,
			width,
			height,
			x: width * Math.cos(Math.PI / -2 + (2 * i * Math.PI) / total + Math.PI / total) - width / 2,
			y: height * Math.sin(Math.PI / -2 + (2 * i * Math.PI) / total + Math.PI / total) - height / 2,
		}));

	$: console.log('layout', layout);
</script>

{#each layout as item, index (item)}
	<slot {item} {index} />
{/each}
