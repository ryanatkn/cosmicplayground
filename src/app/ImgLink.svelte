<script>
	/*

	ideas
	- asset manifest that's read by ImgLink or something like it to get the size right for good loader placeholders
	  - other metadata like prefers pixellation?

	*/

	export let src;
	export let alt;
	export let href = src;
	export let imgStyle = '';
	export let imgClass = '';
	export let linkStyle = '';
	export let linkClass = '';
</script>

<!-- TODO {...$$props} -->
<a {href} target="_blank" style={linkStyle} class={linkClass}>
	<img {src} {alt} style={imgStyle} class={imgClass} />
</a>

<style>
	a {
		cursor: default;
	}
	img {
		transform: scale3d(1, 1, 1);
		transition: transform 0.08s cubic-bezier(0.23, 1, 0.32, 1);
	}
	img:hover {
		transform: scale3d(1.08, 1.08, 1);
	}
	img:active {
		transform: scale3d(1.16, 1.16, 1);
	}
</style>
