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
<a {href} target="_blank" style={linkStyle}>
	<img {src} {alt} style={imgStyle} />
</a>

<style>
	img {
		transform: scale3d(1, 1, 1);
		transition: transform 0.08s cubic-bezier(0.23, 1, 0.320, 1);
	}
	img:hover {
		transform: scale3d(1.08, 1.08, 1);
	}
	img:active {
		transform: scale3d(1.16, 1.16, 1);
	}
</style>
