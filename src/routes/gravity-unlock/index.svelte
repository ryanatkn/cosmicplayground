<script lang="ts">
	import AboutPortalPreview from '$lib/portals/about/Preview.svelte';
	import PortalPreview from '$lib/portals/home/PortalPreview.svelte';
</script>

<div class="gravity-unlock">
	<section class="column">
		<h1>gravity unlock</h1>
		<ul class="markup">
			<li><a href="https://flat.cosmicplayground.org">flat.cosmicplayground.org</a></li>
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
		font-size: var(--font_size_xl3);
	}
	@media (max-width: 530px) {
		.gravity-unlock {
			font-size: var(--font_size_xl);
		}
	}
	ul {
		align-items: center;
		text-align: center;
	}
	a {
		font-weight: 300;
	}
	section {
		margin-top: var(--spacing_xl7);
	}
</style>
