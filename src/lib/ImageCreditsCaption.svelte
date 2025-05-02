<script lang="ts">
	import type {ImageMeta} from '$lib/images.js';

	interface Props {
		image: ImageMeta;
	}

	let { image }: Props = $props();
</script>

<h3 style:margin-top="0"><a href={image.credits.url}>{image.title}</a></h3>
<p>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html image.credits.attribution}
</p>
