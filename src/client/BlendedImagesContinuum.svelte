<script>
	export let images;
	export let value; // `1.6` is 60% opacity of index 2 and 100% opacity of index 1
	export let alt;

	$: opacities = new Array(images.length).fill(0);

	$: {
		const maxIndex = images.length - 1;
		const baseIndex = Math.min(maxIndex, Math.max(0, Math.floor(value)));
		const nextIndex = baseIndex === maxIndex ? null : baseIndex + 1;
		const nextIndexPct = nextIndex === null ? 0 : value % 1;

		// update opacities
		for (let i = 0; i < images.length; i++) {
			opacities[i] = i === baseIndex ? 1 : i === nextIndex ? nextIndexPct : 0;
		}
		opacities = opacities.slice(); // TODO reactive declaration instead?
	}
</script>

{#each images as image, i (image)}
	<img src={image} {alt} style="opacity: {opacities[i]}; z-index: 3;" />
{/each}

<style>
	img {
		position: absolute;
		left: 0;
		top: 0;
		max-width: initial;
	}
</style>
