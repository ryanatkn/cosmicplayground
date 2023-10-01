<script lang="ts">
	import type {ImageMeta} from '$lib/app/images';

	export let images: ImageMeta[];
	export let pick_image: (image: ImageMeta) => void;
</script>

<div class="image-picker">
	{#each images as image (image.info.url)}
		<button on:click={() => pick_image(image)}>
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
		border-width: var(--border_width_3);
		border-color: var(--border_5);
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
