<script lang="ts">
	import {IMAGE_PROCESSING_CREDIT, spaceImages} from '$lib/images';
	import ImageCredits from '$lib/ImageCredits.svelte';
	import Favicon from '$routes/Favicon.svelte';

	const image = spaceImages.find((s) => s.title === 'Tapestry of Blazing Starbirth')!;
</script>

<figure style:margin-top="var(--spacing_3)">
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
	<Favicon size={192} />
</figure>
<ImageCredits {image} />
