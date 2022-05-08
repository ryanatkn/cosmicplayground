<script lang="ts">
	import AboutPortalPreview from '$lib/portals/about/Preview.svelte';
	import PortalPreview from '$lib/portals/home/PortalPreview.svelte';
</script>

<div class="gravity-unlock">
	<section class="markup">
		<h1>gravity unlock</h1>
		<ul>
			<li><a href="/gravity-unlock/studio">studio</a></li>
			<li><a href="/gravity-unlock/atlas">atlas</a></li>
		</ul>
	</section>

	<section>
		<PortalPreview href="/about">
			<AboutPortalPreview />
		</PortalPreview>
	</section>
</div>

<style>
	h1 {
		font-size: 100px;
		text-align: center;
	}
	.gravity-unlock {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: var(--font_size_lg);
	}
	section {
		margin-top: var(--spacing_lg);
	}
</style>
