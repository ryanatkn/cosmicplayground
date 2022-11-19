<script lang="ts">
	import {page} from '$app/stores';
	import Breadcrumbs from '@feltcoop/felt/Breadcrumbs.svelte';

	import Panel from '$lib/app/Panel.svelte';
	import ChunkyButton from '$lib/app/ChunkyButton.svelte';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import {getPortals} from '$lib/app/portals';
	import PortalLink from '$lib/app/PortalLink.svelte';

	const portals = getPortals();
</script>

<!-- TODO how to handle this? -->
<section class="view">
	<Panel>
		<h1>oh no!</h1>
		<h3>no portal exists here</h3>
		<blockquote>
			<Breadcrumbs path={$page.url.pathname} />
		</blockquote>
		<a href="/">
			<ChunkyButton>go back home</ChunkyButton>
		</a>
		<h3>if this was my fault im sorry</h3>
	</Panel>
	<div class="sadface">
		<FloatingIconButton
			label="sadface"
			on:click={() => {
				alert('D:'); // eslint-disable-line no-alert
			}}>D:</FloatingIconButton
		>
	</div>
	<Panel>
		<h2>maybe you want one of these?</h2>
		<ul>
			{#each $portals.data.portals as portal (portal.slug)}
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
