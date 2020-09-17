<script>
	export let image;
</script>

<h3><a href={image.credits.url}>{image.title}</a></h3>
<p>
	{@html image.credits.attribution}
</p>
