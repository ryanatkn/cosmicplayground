<script>
	import Panel from '../../app/Panel.svelte';
	import ChunkyButton from '../../app/ChunkyButton.svelte';
	import FloatingIconButton from '../../app/FloatingIconButton.svelte';
	import {useRouter} from '../../app/routerStore.js';
	import {usePortals} from '../../app/portalsStore.js';
	import PortalLink from '../../app/PortalLink.svelte';
	import {VOID_PORTAL_SLUG} from '../portal.js';

	export const portal = undefined;
	export const width = undefined;
	export const height = undefined;

	const router = useRouter();
	const portals = usePortals();

	$: portalList = $portals.data.portals.filter((p) => p.slug !== VOID_PORTAL_SLUG);
</script>

<!-- TODO how to handle this? -->
<section class="view">
	<Panel>
		<h1>oh no!</h1>
		<h3>no portal exists at cosmicplayground.org/#{$router.slug}</h3>
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
	ul {
		list-style: none;
	}
	li {
		padding: var(--spacing-3);
	}
</style>
