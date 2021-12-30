<script lang="ts">
	import Panel from '$lib/app/Panel.svelte';
	import ChunkyButton from '$lib/app/ChunkyButton.svelte';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import {getPortals} from '$lib/app/portalsStore';
	import PortalLink from '$lib/app/PortalLink.svelte';
	import voidPortal from '$lib/portals/void/data';

	const portals = getPortals();

	$: portalList = $portals.data.portals.filter((p) => p.slug !== voidPortal.name);
</script>

<!-- TODO how to handle this? -->
<section class="view">
	<Panel>
		<h1>oh no!</h1>
		<h3>no portal exists here</h3>
		<a href="/">
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
	ul {
		list-style: none;
	}
	li {
		padding: var(--spacing-3);
	}
</style>
