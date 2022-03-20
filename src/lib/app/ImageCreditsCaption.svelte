<script lang="ts">
	import type {ImageMeta} from '$lib/app/images';

	export let image: ImageMeta;
</script>

<h3><a href={image.credits.url}>{image.title}</a></h3>
<p>
	{@html image.credits.attribution}
</p>
