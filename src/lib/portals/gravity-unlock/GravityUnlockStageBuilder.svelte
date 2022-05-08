<script lang="ts">
	import {createEventDispatcher, onMount} from 'svelte';

	import type {StageData} from '$lib/portals/gravity-unlock/stage';
	import GravityUnlockStage from '$lib/portals/gravity-unlock/GravityUnlockStage.svelte';
	import {Stage} from '$lib/portals/gravity-unlock/gravityUnlockStage';
	import {getDimensions} from '$lib/app/dimensions';
	import {getClock} from '$lib/app/clock';

	/*

TODO ideas

- input the width/height of the world (useful only in `freezeCamera`, unless we want to allow making the game screens smaller)
	- does that make sense? windowing for the world that doesn't match the view?
- think about how we want scaling to work -- maybe no scaling?

- what if you could snapshot anywhere and go back to that state?
	- spacebar would go back to the most recent snapshot (none means t=0)

*/

	export let data: StageData;

	const enableDomCanvasRenderer = false; // TODO use this?

	const dimensions = getDimensions();
	const clock = getClock();

	$: ({width: viewportWidth, height: viewportHeight} = $dimensions);

	const DEFAULT_WORLD_DIMENSIONS = {width: 2560, height: 1440}; // TODO

	const dispatch = createEventDispatcher<{save: StageData}>();

	onMount(() => {
		createStage();
	});

	// TODO disable save if the data is unchanged (should we use immer, or what?)
	// and maybe save automatically sometimes?
	const saveData = () => {
		dispatch('save', data);
	};
	const importData = () => {
		const raw = prompt('imported data', JSON.stringify(data)); // eslint-disable-line no-alert
		if (!raw) return;
		try {
			data = JSON.parse(raw);
		} catch (err) {
			alert('failed to parse'); // eslint-disable-line no-alert
			return;
		}
		cameraUnlocked = !data.freezeCamera;
		createStage();
	};

	let cameraUnlocked = false; // TODO `see `freezeCamera`

	// TODO should we pass through plain numbers or a dimensions object?
	// // TODO what about the camera zoom relative to what can fit in the dimensions?
	let viewWidth: number;
	let viewHeight: number;
	let worldWidth: number;
	let worldHeight: number;
	// TODO make this a helper to clarify the deps `updateDimensions`
	$: if (cameraUnlocked) {
		// Expand the world dimensions to fit the viewport dimensions.
		// It needs to match the viewport aspect ratio and
		// cover the entire default world dimensions.
		viewWidth = viewportWidth;
		viewHeight = viewportHeight;
		const worldMinWidth = DEFAULT_WORLD_DIMENSIONS.width;
		const worldMinHeight = DEFAULT_WORLD_DIMENSIONS.height;
		const worldWidthRatio = worldMinWidth / viewWidth;
		const worldHeightRatio = worldMinHeight / viewHeight;
		if (worldHeightRatio > 1 && worldHeightRatio > worldWidthRatio) {
			worldHeight = worldMinHeight;
			worldWidth = (viewWidth * worldHeightRatio) | 0;
		} else if (worldWidthRatio > 1) {
			worldWidth = worldMinWidth;
			worldHeight = (viewHeight * worldWidthRatio) | 0;
		} else {
			worldWidth = viewWidth;
			worldHeight = viewHeight;
		}
	} else {
		worldWidth = DEFAULT_WORLD_DIMENSIONS.width;
		worldHeight = DEFAULT_WORLD_DIMENSIONS.height;
		const worldAspectRatio = worldWidth / worldHeight;
		const viewportAspectRatio = viewportWidth / viewportHeight;
		viewWidth = (viewportWidth * Math.min(1, worldAspectRatio / viewportAspectRatio)) | 0;
		viewHeight = (viewportHeight * Math.min(1, viewportAspectRatio / worldAspectRatio)) | 0;
	}

	let stage: Stage | null = null;

	$: if (stage) stage.freezeCamera = cameraUnlocked; // TODO make this a method?

	const destroyStage = () => {
		if (!stage) return;
		stage.destroy();
		stage = null;
	};
	const createStage = () => {
		if (stage) destroyStage();
		stage = new Stage({
			viewHeight,
			viewWidth,
			viewportHeight,
			viewportWidth,
			worldHeight,
			worldWidth,
		});
	};
	const resetStage = () => {
		createStage();
	};

	const finish = async () => {
		console.log('FINISH');
		clock.pause();
	};

	let expandControls = true;
	const toggleExpandControls = () => (expandControls = !expandControls);

	const onWindowKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && !e.ctrlKey) {
			e.stopImmediatePropagation();
			e.preventDefault();
			toggleExpandControls();
		} else if (e.key === ' ') {
			e.stopImmediatePropagation();
			e.preventDefault();
			resetStage();
		}
	};
</script>

<svelte:window on:keydown={onWindowKeydown} />

<div class="controls">
	<button on:click={toggleExpandControls}
		>{#if expandControls}-{:else}+{/if}</button
	>
	{#if expandControls}
		<button on:click={importData}>import</button>
		<button on:click={saveData}>save</button>
		<button on:click={resetStage}>reset</button>
		{#if stage}
			<label><input type="checkbox" bind:checked={cameraUnlocked} /> free camera</label>
			<button on:click={() => clock.toggle()}
				>{#if $clock.running}pause{:else}play{/if}</button
			>
		{/if}
		<!-- <Checkbox /> -->
	{/if}
</div>

{#if expandControls}
	<div class="markup">
		<pre>{data ? JSON.stringify(data) : null}</pre>
	</div>
{/if}

{#if stage}
	<!-- TODO ideally this is reactive to `stage`, not keyed, is fine for now -->
	{#key stage}
		<GravityUnlockStage
			{viewportWidth}
			{viewportHeight}
			{viewWidth}
			{viewHeight}
			{worldWidth}
			{worldHeight}
			{cameraUnlocked}
			{stage}
			{finish}
			{enableDomCanvasRenderer}
		/>
	{/key}
{/if}

<style>
	.controls {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
</style>
