<script lang="ts">
	import {createEventDispatcher} from 'svelte';

	import type {StageData} from '$lib/portals/gravity-unlock/stage';
	import GravityUnlockStage from '$lib/portals/gravity-unlock/GravityUnlockStage.svelte';

	export let data: StageData;

	const dispatch = createEventDispatcher<{save: StageData}>();

	// TODO disable save if the data is unchanged (should we use immer, or what?)
	// and maybe save automatically sometimes?
	const saveData = () => {
		dispatch('save', data);
	};
	const exportData = () => {
		prompt('exported data', JSON.stringify(data)); // eslint-disable-line no-alert
	};
	const importData = () => {
		const raw = prompt('imported data', JSON.stringify(data)); // eslint-disable-line no-alert
		if (!raw) return;
		try {
			data = JSON.parse(raw);
		} catch (err) {
			alert('failed to parse'); // eslint-disable-line no-alert
		}
	};
</script>

<button on:click={exportData}>export</button>
<button on:click={importData}>import</button>
<button on:click={saveData}>save</button>

<div class="markup">
	<pre>{data ? JSON.stringify(data) : null}</pre>
</div>

<GravityUnlockStage
	{viewportWidth}
	{viewportHeight}
	{viewWidth}
	{viewHeight}
	{worldWidth}
	{worldHeight}
	{speedBoosterEnabled}
	{strengthBoosterEnabled}
	{strengthBooster1Enabled}
	{strengthBooster2Enabled}
	{strengthBooster3Enabled}
	{cameraUnlocked}
	bind:starshipX
	bind:starshipY
	bind:starshipAngle
	bind:starshipShieldRadius
	{stage}
	exit={exitStarshipMode}
	{finish}
	{enableDomCanvasRenderer}
/>
