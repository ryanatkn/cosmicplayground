<script lang="ts">
	import {page} from '$app/state';
	import Breadcrumb from '@ryanatkn/fuz/Breadcrumb.svelte';
	import {base} from '$app/paths';

	import Panel from '$lib/Panel.svelte';
	import ChunkyButton from '$lib/ChunkyButton.svelte';
	import {portals_context} from '$lib/portals.js';
	import PortalLink from '$lib/PortalLink.svelte';

	const portals = portals_context.get();
</script>

<!-- TODO how to handle this? -->
<section class="page box">
	<Panel>
		<div class="box">
			<h1>void</h1>
			<p>nothing is here</p>
			<Breadcrumb path={page.url.pathname}>🌠</Breadcrumb>
		</div>
		<a href="/">
			<ChunkyButton>go back home</ChunkyButton>
		</a>
	</Panel>
	<div class="sadface">D:</div>
	<Panel>
		<div class="width_md">
			<h2 class="mb_lg text_align_center">maybe you want one of these?</h2>
			<ul class="box row wrap">
				{#each $portals.data.portals as portal (portal.slug)}
					<li role="none">
						<PortalLink slug={portal.slug} />
					</li>
				{/each}
			</ul>
		</div>
	</Panel>
	<div class="box">
		<h2>maybe it was the computers fault</h2>
	</div>
	<a hidden href="{base}/unlock">:]</a>
</section>

<style>
	.page {
		margin-bottom: var(--space_xl5);
	}
	.sadface {
		opacity: 0.6;
		display: flex;
		justify-content: center;
		font-size: var(--size_xl5);
		font-weight: 300;
	}
	ul {
		list-style: none;
	}
	li {
		padding: var(--spacing-3);
	}
</style>
