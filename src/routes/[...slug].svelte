<script lang="ts">
	import {type SvelteComponent} from 'svelte';

	import {findPortalBySlug, getPortals} from '$lib/app/portalsStore';
	import homePortal from '$lib/portals/home/data';
	import {type PortalsData} from '$lib/portals/portal';
	import voidPortal from '$lib/portals/void/data';
	import VoidPortalView from '$lib/portals/void/View.svelte';

	let view: typeof SvelteComponent | undefined;
	const loadView = async (portalsData: PortalsData, slug: string) => {
		const data = findPortalBySlug(portalsData, slug);
		if (data === voidPortal) {
			view = VoidPortalView;
			return;
		}
		// TODO maybe load from cache synchronously?
		try {
			const viewModule = await import(`../lib/portals/${slug}/View.svelte`);
			view = viewModule.default;
		} catch (err) {
			console.error('error loading view', err);
			// TODO show error view? "crud.."
		}
	};

	const portals = getPortals();
	$: ({selectedPortal} = $portals);
	$: selectedPortal &&
		selectedPortal !== homePortal &&
		loadView($portals.data, selectedPortal.slug);
</script>

<!-- TODO loading state? -->
{#if view}
	<svelte:component this={view} />
{/if}
