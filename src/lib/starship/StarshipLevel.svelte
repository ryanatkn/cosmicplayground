<script lang="ts">
	import type {LevelData} from '$lib/starship/levels';

	export let level: LevelData;
</script>

<div class="starship-level">
	<button
		class="image-button"
		on:click={() => {
			console.log(`level`, level);
		}}
	>
		<img src={level.imageData.thumbnail} />
		<div class="title">{level.title}</div>
	</button>
</div>

<style>
	button {
		position: relative;
	}
	.title {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font_size_lg);
		text-align: center;
		font-weight: 300;
	}
</style>
