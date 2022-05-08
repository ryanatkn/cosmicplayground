<script lang="ts">
	import {createEventDispatcher} from 'svelte';

	import type {StageData} from '$lib/portals/gravity-unlock/stage';
	import GravityUnlockStage from '$lib/portals/gravity-unlock/GravityUnlockStage.svelte';
	import {Stage} from '$lib/portals/gravity-unlock/gravityUnlockStage';
	import {getDimensions} from '$lib/app/dimensions';
	import {getClock} from '$lib/app/clock';

	export let data: StageData;

	const enableDomCanvasRenderer = false; // TODO use this?

	const dimensions = getDimensions();
	const clock = getClock();

	$: ({width: viewportWidth, height: viewportHeight} = $dimensions);

	const DEFAULT_WORLD_DIMENSIONS = {width: 2560, height: 1440}; // TODO

	const dispatch = createEventDispatcher<{save: StageData}>();

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

	const destroyStage = () => {
		if (!stage) return;
		stage.destroy();
		stage = null;
	};
	const createStage = () => {
		destroyStage();
		stage = new Stage({
			viewHeight,
			viewWidth,
			viewportHeight,
			viewportWidth,
			worldHeight,
			worldWidth,
		});
	};
	const toggleStage = () => (stage ? destroyStage() : createStage());

	const finish = () => {
		console.log('FINISH');
		// probably don't destroy
	};
	const exit = () => {
		console.log('EXIT');
		destroyStage();
	};

	const toggleFreezeCamera = () => {
		cameraUnlocked = !cameraUnlocked;
		// TODO make this a WYSIWYG JSON editor component instead
		if (!stage) return;
		stage.freezeCamera = cameraUnlocked; // TODO does this need to go through a method?
		console.log(`stage.freezeCamera`, stage.freezeCamera);
	};

	let expandControls = true;
	const toggleExpandControls = () => (expandControls = !expandControls);

	const onWindowKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.stopImmediatePropagation();
			e.preventDefault();
			toggleExpandControls();
		} else if (e.key === ' ') {
			e.stopImmediatePropagation();
			e.preventDefault();
			toggleStage();
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
		{#if stage}
			<button on:click={destroyStage}>destroy stage</button>
			<button on:click={toggleFreezeCamera}>toggle <code>freezeCamera</code></button>
			<button on:click={() => clock.toggle()}
				>{#if $clock.running}pause{:else}play{/if}</button
			>
		{:else}
			<button on:click={createStage}>create stage</button>
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
			{exit}
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
