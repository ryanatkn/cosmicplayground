<script lang="ts">
	import {getStores} from '$app/stores';

	const {page} = getStores();

	import Panel from '$lib/app/Panel.svelte';
	import ChunkyButton from '$lib/app/ChunkyButton.svelte';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import {get_portals} from '$lib/app/portalsStore';
	import PortalLink from '$lib/app/PortalLink.svelte';
	import {VOID_PORTAL_SLUG} from '$lib/portals/portal';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;
	export let width: number;
	export let height: number;

	portal;
	width;
	height;

	const portals = get_portals();

	$: portalList = $portals.data.portals.filter((p) => p.slug !== VOID_PORTAL_SLUG);
</script>

<!-- TODO how to handle this? -->
<section class="view">
	<Panel>
		<h1>oh no!</h1>
		<h3>no portal exists at {$page.path}</h3>
		<a href="#home">
			<ChunkyButton>go back home</ChunkyButton>
		</a>
		<h3>if this was my fault im sorry</h3>
	</Panel>
	<div class="sadface">
		<FloatingIconButton label="sadface" on:click={() => alert('D:')}>D:</FloatingIconButton>
	</div>
	<Panel>
		<h2>maybe you want one of these?</h2>
		<ul>
			{#each portalList as portal (portal.slug)}
				<li>
					<PortalLink slug={portal.slug} />
				</li>
			{/each}
		</ul>
	</Panel>
</section>

<style>
	.view {
		text-align: center;
	}
	.sadface {
		opacity: 0.6;
		display: flex;
		justify-content: center;
	}
	li {
		padding: var(--spacing-3);
	}
</style>
