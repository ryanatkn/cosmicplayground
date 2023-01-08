<script lang="ts">
	import {IMAGE_PROCESSING_CREDIT, spaceImages} from '$lib/app/images';
	import ImageCredits from '$lib/app/ImageCredits.svelte';

	$: image = spaceImages.find((s) => s.title === 'Tapestry of Blazing Starbirth')!;
</script>

<figure style:margin-top="var(--spacing_xl3)">
	<figcaption>
		<h3>cosmicplayground banner and icon</h3>
		<p>
			<a
				href="https://www.nasa.gov/press-release/nasa-s-webb-reaches-alignment-milestone-optics-working-successfully"
			>
				NASA’s Webb Reaches Alignment Milestone, Optics Working Successfully
			</a>
			by <a href="https://nasa.gov">NASA</a>/<a href="https://www.stsci.edu/">STScI</a> (March 16,
			2022),
			{IMAGE_PROCESSING_CREDIT}
		</p>
	</figcaption>
	<img src="/favicon.png" width="192" height="192" alt="cosmicplayground icon" />
</figure>
<ImageCredits {image} />
