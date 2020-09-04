<script>
	export let images;
	export let value; // float, where `0 <= value < images.length`
	export let alt;

	let opacities = new Array(images.length).fill(0);

	$: {
		const baseIndex = Math.floor(value);
		const nextIndex = baseIndex === images.length - 1 ? 0 : baseIndex + 1;
		const nextIndexPct = value - baseIndex;

		// update opacities
		for (let i = 0; i < images.length; i++) {
			let opacity = 0;
			if (i === baseIndex) {
				opacity = 1;
			} else if (i === nextIndex) {
				opacity = nextIndexPct;
			}
			opacities[i] = opacity;
		}
		opacities = opacities.slice(); // TODO !! maybe just change this to a reactive declaration?
	}
</script>

{#each images as image, i (image)}
	<img
		src={image}
		{alt}
		style="opacity: {opacities[i]}; z-index: {i === images.length - 1 && opacities[i] === 1 ? 1 : 2};"
	/>
{/each}

<style>
	img {
		position: absolute;
		left: 0;
		top: 0;
		max-width: initial;
	}
</style>
