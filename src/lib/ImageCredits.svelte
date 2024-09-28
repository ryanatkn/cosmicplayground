<script lang="ts">
	import ImageCreditsCaption from '$lib/ImageCreditsCaption.svelte';
	import type {ImageMeta} from '$lib/images.js';

	export let image: ImageMeta;
</script>

<figure>
	<img
		src={image.thumbnail.url}
		alt={image.title}
		width={image.thumbnail.width}
		height={image.thumbnail.height}
	/>
	<figcaption>
		<ImageCreditsCaption {image} />
	</figcaption>
</figure>
