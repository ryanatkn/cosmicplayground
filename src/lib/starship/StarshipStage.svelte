<script lang="ts">
	import {toLevelDatasByStageName, type StageData} from '$lib/starship/levels';

	export let stage: StageData;

	$: levels = toLevelDatasByStageName(stage.name);
</script>

<div class="starship-stage" style:height="{stage.imageMeta.thumbnail.height * 2}px">
	<img class="pixelated" src={stage.imageMeta.thumbnail.url} alt={stage.imageMeta.title} />
	<div class="levels">
		<div class="main-levels">
			<slot level={levels[0]} {levels} /><slot level={levels[1]} {levels} />
		</div>
		{#if levels.length > 2}<div class="secondary-levels">
				<slot level={levels[2]} {levels} />
			</div>{/if}
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
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}
	.main-levels {
		display: flex;
		align-items: center;
	}
	.secondary-levels {
		margin-top: var(--spacing_sm);
	}
</style>
