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
	import {scale} from 'svelte/transition';

	import {findPortalBySlug, getPortals} from '$lib/app/portalsStore';
	import homePortal from '$lib/portals/home/data';
	import {type PortalsData} from '$lib/portals/portal';
	import voidPortal from '$lib/portals/void/data';
	import VoidPortalView from '$lib/portals/void/View.svelte';

	let swapped = false;

	let view1: typeof SvelteComponent | undefined;
	let view2: typeof SvelteComponent | undefined;

	const updateView = (view: typeof SvelteComponent) => {
		if (swapped) {
			view1 = view;
		} else {
			view2 = view;
		}
		swapped = !swapped;
	};

	const loadView = async (portalsData: PortalsData, slug: string) => {
		if (cache.has(slug)) {
			updateView(cache.get(slug)!);
			return;
		}
		const data = findPortalBySlug(portalsData, slug);
		if (data === voidPortal) {
			cache.set(slug, VoidPortalView);
			updateView(VoidPortalView);
			return;
		}
		try {
			// TODO brittle handling of the home portal exception
			const portalPath = slug === homePortal.slug ? homePortal.name : slug;
			const viewModule = await import(`../lib/portals/${portalPath}/View.svelte`);
			cache.set(slug, viewModule.default);
			updateView(viewModule.default);
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
{#if view1 && !swapped}
	<div class="inner" transition:scale>
		<svelte:component this={view1} />
	</div>
{/if}
{#if view2 && swapped}
	<div class="inner" transition:scale>
		<svelte:component this={view2} />
	</div>
{/if}

<style>
	.inner {
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
