<script>
	export let images;
	export let pickImage;
</script>

<div class="image-picker">
	{#each images as image (image.info.url)}
		<button on:click={() => pickImage(image)}>
			<img
				src={image.thumbnail.url}
				alt={image.title}
				width={image.thumbnail.width}
				height={image.thumbnail.height}
			/>
		</button>
	{/each}
</div>

<style>
	.image-picker {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
	button {
		padding: 0;
		margin: var(--spacing-5);
		border-width: var(--border_width_md);
		border-color: var(--light_border_color);
		border-style: var(--clickable_border_style);
	}
	button:hover {
		border-color: var(--space_color);
		border-style: var(--clickable_border_style__hover);
	}
	button:active {
		border-style: var(--clickable_border_style__active);
	}
</style>
