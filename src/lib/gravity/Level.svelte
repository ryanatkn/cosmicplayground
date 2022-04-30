<script lang="ts">
	import {toPhaseDatasByLevelName, type LevelData} from '$lib/gravity/phases';

	export let level: LevelData;

	$: phases = toPhaseDatasByLevelName(level.name);
</script>

<div class="level" style:height="{level.imageMeta.thumbnail.height * 2}px">
	<img class="pixelated" src={level.imageMeta.thumbnail.url} alt={level.imageMeta.title} />
	<div class="phases">
		<div class="main-phases">
			<slot phase={phases[0]} {phases} /><slot phase={phases[1]} {phases} />
		</div>
		{#if phases.length > 2}<div class="secondary-phases">
				<slot phase={phases[2]} {phases} />
			</div>{/if}
	</div>
</div>

<style>
	.level {
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
	.phases {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}
	.main-phases {
		display: flex;
		align-items: center;
	}
	.secondary-phases {
		margin-top: var(--spacing_sm);
	}
</style>
