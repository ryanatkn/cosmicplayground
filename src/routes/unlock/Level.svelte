<script lang="ts">
	import {toPhaseDatasByLevelName, type LevelData} from '$routes/unlock/phases';

	export let level: LevelData;

	$: phases = toPhaseDatasByLevelName(level.name);

	$: mainPhases = phases.filter((p) => p.phase === 0);
	$: secondaryPhases = phases.filter((p) => p.phase === 1);

	$: if (phases.length !== mainPhases.length + secondaryPhases.length) {
		throw Error('There are some unused phases in Level.svelte');
	}
</script>

<div class="level" style:height="{level.imageMeta.thumbnail.height * 2}px">
	<img class="pixelated" src={level.imageMeta.thumbnail.url} alt={level.imageMeta.title} />
	<div class="phases">
		<div class="main-phases">
			{#each mainPhases as phase (phase)}<slot {phase} {phases} />{/each}
		</div>
		{#if secondaryPhases.length}<div class="secondary-phases">
				{#each secondaryPhases as phase (phase)}<slot {phase} {phases} />{/each}
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
	}
	.main-phases {
		display: flex;
		align-items: center;
	}
	.secondary-phases {
		display: flex;
		align-items: center;
		margin-top: var(--spacing_xl4);
	}
</style>
