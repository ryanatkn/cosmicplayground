<script lang="ts">
	import ImageCreditsCaption from './ImageCreditsCaption.svelte';

	export let image;
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
