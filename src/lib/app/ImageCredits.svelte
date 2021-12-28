<script lang="ts">
	import ImageCreditsCaption from '$lib/app/ImageCreditsCaption.svelte';
	import {type ImageMeta} from '$lib/app/images';

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
