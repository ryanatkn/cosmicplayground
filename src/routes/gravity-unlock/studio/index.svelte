<script lang="ts">
	import {initialStageData} from '$lib/portals/gravity-unlock/stage';
	import GravityUnlockStageBuilder from '$lib/portals/gravity-unlock/GravityUnlockStageBuilder.svelte';
	import {loadFromStorage, setInStorage} from '$lib/util/storage';

	// TODO store an index and each separate?
	const STORAGE_KEY_STAGES = 'cpg_stages';

	const data = loadFromStorage(STORAGE_KEY_STAGES, initialStageData);
</script>

<div class="gravity-unlock-studio">
	<GravityUnlockStageBuilder {data} on:save={(e) => setInStorage(STORAGE_KEY_STAGES, e.detail)} />
</div>

<style>
	.gravity-unlock-studio {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
