<script lang="ts">
	import type {ImageMeta} from '$lib/images';

	export let image: ImageMeta;
</script>

<h3 style:margin-top="0"><a href={image.credits.url}>{image.title}</a></h3>
<p>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html image.credits.attribution}
</p>
