<script lang="ts">
	import {spaceImages} from '$lib/images';
	import PortalLink from '$lib/PortalLink.svelte';
	import Details from '$lib/Details.svelte';
	import ImageCredits from '$lib/ImageCredits.svelte';

	const visibleCount = 2; // TODO increase
	const visibleImages = spaceImages.slice(0, visibleCount);
	const hiddenImages = spaceImages.slice(visibleCount);
</script>

<PortalLink slug="starlit-hammock" />
gently swings under these wondrous views from
<a href="https://www.spacetelescope.org/copyright/">Hubble</a>,
<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>

<div class="credits-space-images">
	<ul>
		{#each visibleImages as image (image.info.url)}
			<li>
				<ImageCredits {image} />
			</li>
		{/each}
	</ul>

	<!-- TODO replace with a <Details /> component that lazily renders its contents, this causes a ton of unnecessary image requests -->
	{#if hiddenImages.length}
		<Details>
			<summary slot="summary">
				<h3 class="inline">see {hiddenImages.length} more images</h3>
			</summary>
			<ul>
				{#each hiddenImages as image (image.info.url)}
					<li>
						<ImageCredits {image} />
					</li>
				{/each}
			</ul>
		</Details>
	{/if}
</div>

<style>
	.credits-space-images ul {
		padding-left: 0;
	}
	.credits-space-images li {
		margin-bottom: var(--spacing-3);
		list-style: none;
	}
</style>
