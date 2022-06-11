<script lang="ts">
	import Breadcrumbs from '@feltcoop/felt/ui/Breadcrumbs.svelte';

	import Panel from '$lib/app/Panel.svelte';
	import AboutPreview from '$lib/portals/about/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
</script>

<div>
	<div class="breadcrumbs">
		<Panel>
			<div class="markup centered">
				<section>
					<Breadcrumbs>🌠</Breadcrumbs>
				</section>
			</div>
		</Panel>
	</div>
	<PortalPreview href="/about">
		<AboutPreview />
	</PortalPreview>
</div>

<style>
	.breadcrumbs {
		/* TODO don't hardcode */
		padding-left: 12px;
		padding-right: 12px;
	}
	/* TODO hacky */
	.breadcrumbs :global(.panel) {
		margin-top: 0;
	}
</style>
