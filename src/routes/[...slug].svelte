<script lang="ts" context="module">
	// TODO something is weird where this runs a second time on the first nav
	// (is this SvelteKit bug or user error?)
	// console.log('TODO expected this only to ever run once');

	// The dynamic view loading network requests made by the component below
	// are cached already by the browser,
	// but this allows us to synchronously mount the selected view
	// instead of waiting for the `import`'s promise tick.
	const cache: Map<string, typeof SvelteComponent> = new Map();
</script>

<script lang="ts">
	import {type SvelteComponent} from 'svelte';

	import {findPortalBySlug, getPortals} from '$lib/app/portalsStore';
	import homePortal from '$lib/portals/home/data';
	import {type PortalsData} from '$lib/portals/portal';
	import voidPortal from '$lib/portals/void/data';
	import VoidPortalView from '$lib/portals/void/View.svelte';

	let view: typeof SvelteComponent | undefined;
	const loadView = async (portalsData: PortalsData, slug: string) => {
		if (cache.has(slug)) {
			view = cache.get(slug)!;
			return;
		}
		const data = findPortalBySlug(portalsData, slug);
		if (data === voidPortal) {
			cache.set(slug, VoidPortalView);
			view = VoidPortalView;
			return;
		}
		try {
			// TODO brittle handling of the home portal exception
			const portalPath = slug === homePortal.slug ? homePortal.name : slug;
			const viewModule = await import(`../lib/portals/${portalPath}/View.svelte`);
			cache.set(slug, viewModule.default);
			view = viewModule.default;
		} catch (err) {
			console.error('error loading view', err);
			// TODO show error view? "crud.."
		}
	};

	const portals = getPortals();
	$: ({selectedPortal} = $portals);
	$: selectedPortal && loadView($portals.data, selectedPortal.slug);
</script>

<!-- TODO loading state? animate transitions between views? -->
{#if view}
	<svelte:component this={view} />
{/if}
