<script lang="ts">
	import {createEventDispatcher, onMount} from 'svelte';

	import {initialStageData, type StageData} from '$lib/portals/gravity-unlock/stage';
	import GravityUnlockStage from '$lib/portals/gravity-unlock/GravityUnlockStage.svelte';
	import {Stage} from '$lib/portals/gravity-unlock/gravityUnlockStage';
	import {getDimensions} from '$lib/app/dimensions';
	import {getClock} from '$lib/app/clock';
	// import {enableGlobalHotkeys} from '$lib/util/dom'; // TODO see below

	/*

TODO ideas

- input player speed
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
	$: ({running} = $clock);

	const DEFAULT_WORLD_DIMENSIONS = {width: 2560, height: 1440}; // TODO

	const dispatch = createEventDispatcher<{save: StageData}>();

	onMount(() => {
		createStage();
	});

	// TODO disable save if the data is unchanged (should we use immer, or what?)
	// and maybe save automatically sometimes?
	const saveData = () => {
		const updatedData: StageData = {
			freezeCamera: !cameraUnlocked,
			playerSpeed,
			playerStrength,
			timeDilation,
		}; // TODO maybe cache this?
		dispatch('save', updatedData);
	};
	const importData = () => {
		let raw = prompt('imported data', JSON.stringify(data)); // eslint-disable-line no-alert
		if (raw === null) return;
		raw = raw.trim();
		if (raw) {
			try {
				data = JSON.parse(raw);
			} catch (err) {
				alert('failed to parse'); // eslint-disable-line no-alert
				return;
			}
		} else {
			data = initialStageData;
		}
		// TODO refactor with code below
		cameraUnlocked = !data.freezeCamera;
		playerSpeed = data.playerSpeed;
		playerStrength = data.playerStrength;
		timeDilation = data.timeDilation;
		createStage();
	};

	// TODO refactor with code above
	let cameraUnlocked = !data.freezeCamera; // TODO `see `freezeCamera`
	let playerSpeed = data.playerSpeed;
	let playerStrength = data.playerStrength;
	let timeDilation = data.timeDilation;
	$: if (stage) stage.freezeCamera = cameraUnlocked; // TODO make this a method?
	$: if (stage) stage.player.speed = playerSpeed;
	$: if (stage) stage.player.strength = playerStrength;
	$: if (stage) stage.timeDilation = timeDilation;

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
		const enableGlobalHotkeys = (_: any) => true; // TODO remove this once Felt is upgraded, see in 2 places
		if (e.key === 'Escape' && !e.ctrlKey && enableGlobalHotkeys(e.target)) {
			e.stopImmediatePropagation();
			e.preventDefault();
			toggleExpandControls();
		} else if (e.key === ' ' && enableGlobalHotkeys(e.target)) {
			e.stopImmediatePropagation();
			e.preventDefault();
			resetStage();
		} else if (e.key === 's' && e.ctrlKey && enableGlobalHotkeys(e.target)) {
			e.stopImmediatePropagation();
			e.preventDefault();
			saveData();
		}
	};
</script>

<svelte:window on:keydown={onWindowKeydown} />

<div class="controls">
	<button
		on:click={toggleExpandControls}
		aria-label={expandControls ? 'hide controls' : 'show controls'}
		title="[Escape] {expandControls ? 'hide controls' : 'show controls'}"
		>{#if expandControls}-{:else}+{/if}</button
	>
	{#if expandControls}
		<button title="import JSON data" on:click={importData}>import</button>
		<button title="[ctrl+s] save to localStorage" on:click={saveData}>save</button>
		<button title="[Spacebar] reset the simulation" on:click={resetStage}>reset</button>
		{#if stage}
			<button
				title="[Backtick] {running ? 'pause the simulation' : 'play the simulation'}"
				on:click={() => clock.toggle()}
				>{#if running}pause{:else}play{/if}</button
			>
		{/if}
		<!-- <Checkbox /> -->
	{/if}
</div>

{#if expandControls}
	<div class="stage-data-controls">
		{#if stage}
			<label><input type="checkbox" bind:checked={cameraUnlocked} /> free camera</label>
			<label
				><input type="range" bind:value={playerStrength} min={0} max={10} step={0.1} />
				{playerStrength} player strength</label
			>
			<label
				><input type="range" bind:value={playerSpeed} min={0} max={10} step={0.1} />
				{playerSpeed} player speed</label
			>
			<label
				><input type="range" bind:value={timeDilation} min={0} max={10} step={0.1} />
				{timeDilation} time dilation</label
			>
		{/if}
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
	.stage-data-controls {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
	}
</style>
