<script lang="ts">
	import {toLevelDatasByStageName, type StageData} from '$lib/starship/levels';

	export let stage: StageData;

	$: levels = toLevelDatasByStageName(stage.name);
</script>

<div class="starship-stage" style:height="{stage.imageMeta.thumbnail.height * 2}px">
	<img class="pixelated" src={stage.imageMeta.thumbnail.url} alt={stage.imageMeta.title} />
	<div class="levels">
		{#each levels as level (level.name)}
			<slot {level} {levels} />
		{/each}
	</div>
</div>

<style>
	.starship-stage {
		display: flex;
		position: relative;
	}
	img {
		position: absolute;
		inset: 0;
		z-index: 0;
		height: 100%;
		width: auto;
		margin: auto;
	}
	.levels {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
