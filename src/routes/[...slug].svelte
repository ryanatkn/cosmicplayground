<script lang="ts">
	import {getPortals} from '$lib/app/portalsStore';
	// import VoidPortalView from '$lib/portals/void/View.svelte';
	import homePortal from '$lib/portals/home/data';

	const portals = getPortals();
	let view: any;
	$: ({selectedPortal} = $portals);
	$: selectedPortal &&
		selectedPortal !== homePortal &&
		import(`../lib/portals/${selectedPortal.slug}/view.ts`).then((viewModule) => {
			console.log('loaded view', viewModule);
			view = viewModule.view;
		});

	$: console.log('selectedPortal', selectedPortal);
	$: console.log('view', view);
</script>

<!-- TODO loading state -->
{#if view}
	<svelte:component this={view} />
{:else}
	<!-- <VoidPortalView /> -->
{/if}
