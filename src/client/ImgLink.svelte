<script>
	/*

	ideas
	- asset manifest that's read by ImgLink or something like it to get the size right for good loader placeholders
	  - other metadata like prefers pixellation?

	*/

	export let src;
	export let alt;
	export let href = src;
	export let imgStyle;
	export let linkStyle;
</script>

<!-- TODO {...$$props} -->
<a {href} style={linkStyle}>
	<img {src} {alt} style={imgStyle} />
</a>
