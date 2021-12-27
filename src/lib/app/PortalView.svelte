<script lang="ts">
	import {type PortalData} from '$lib/portals/portal';
	import {afterUpdate} from 'svelte';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	// TODO probably want to extract this logic
	// TODO this is hardcoded to restoring scroll on the `window` object,
	// so it won't work with multiple portals onscreen
	// (currently not a usecase, but aspirationally want to do that in the future)

	// This flag marks the scroll position as dirty.
	// We need to update the scroll position only after the portal mounts,
	// so it gets flushed in `afterUpdate`.
	// Less hacky than doing `await tick()` after a slug change.
	let shouldRestoreScrollPosition = false;
	interface ScrollPosition {
		x: number;
		y: number;
	}
	const scrollPositionsBySlug: Map<string, ScrollPosition> = new Map();
	$: portal.slug, (shouldRestoreScrollPosition = true);
	afterUpdate(() => {
		if (shouldRestoreScrollPosition) {
			restoreScrollPosition(scrollPositionsBySlug, portal.slug);
			shouldRestoreScrollPosition = false;
		}
	});
	const restoreScrollPosition = (
		scrollPositionsBySlug: Map<string, ScrollPosition>,
		slug: string,
	) => {
		const scrollPosition = scrollPositionsBySlug.get(slug);
		const x = scrollPosition ? scrollPosition.x : 0;
		const y = scrollPosition ? scrollPosition.y : 0;
		window.scrollTo(x, y);
	};
	const onScroll = () => {
		let scrollPosition = scrollPositionsBySlug.get(portal.slug);
		if (!scrollPosition) scrollPositionsBySlug.set(portal.slug, (scrollPosition = {x: 0, y: 0}));
		scrollPosition.x = window.scrollX;
		scrollPosition.y = window.scrollY;
	};
</script>

<svelte:window on:scroll|passive={onScroll} />

<svelte:component this={portal.View} {portal} {width} {height} />
