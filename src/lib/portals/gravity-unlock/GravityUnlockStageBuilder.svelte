<script lang="ts">
	import {createEventDispatcher, onMount} from 'svelte';

	import {initialStageData, type StageData} from '$lib/portals/gravity-unlock/stage';
	import GravityUnlockStage from '$lib/portals/gravity-unlock/GravityUnlockStage.svelte';
	import {Stage} from '$lib/portals/gravity-unlock/gravityUnlockStage';
	import {getDimensions} from '$lib/app/dimensions';
	import {getClock} from '$lib/app/clock';
	import {getPixi} from '$lib/app/pixi';
	import {enableGlobalHotkeys} from '$lib/util/dom';

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
	const pixi = getPixi();

	$: ({width: viewportWidth, height: viewportHeight} = $dimensions);
	$: ({running} = $clock);

	const DEFAULT_WORLD_DIMENSIONS = {width: 2560, height: 1440}; // TODO

	const dispatch = createEventDispatcher<{save: StageData}>();

	let savedData: StageData = data;

	onMount(() => {
		createStage();
	});

	// TODO disable save if the data is unchanged (should we use immer, or what?)
	// and maybe save automatically sometimes?
	const saveData = () => {
		if (!stage) return;
		savedData = stage.toData();
		dispatch('save', savedData);
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
	};

	$: updateFromData(data);
	const updateFromData = (data: StageData) => {
		console.log(`updateFromData`, data);
		savedData = data;
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
			data: savedData || data,
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
		} else if (e.key === '}' && enableGlobalHotkeys(e.target)) {
			e.stopImmediatePropagation();
			e.preventDefault();
			simulate(100);
		} else if (e.key === ']' && enableGlobalHotkeys(e.target)) {
			e.stopImmediatePropagation();
			e.preventDefault();
			if (e.ctrlKey) {
				simulate(10);
			} else {
				simulate(1);
			}
		}
	};

	const simulate = (ticks: number): void => {
		if (!stage) return;
		for (let i = 0; i < ticks; i++) {
			stage.update(1000 / 60);
		}
		if (!running) pixi.app.render(); // TODO should `stage` wrap the `app` and ticker? wouldn't need `pixi` here then
	};
</script>

<svelte:window on:keydown={onWindowKeydown} />

<div class="controls">
	{#if expandControls}
		<div class="stage-data-controls-wrapper">
			{#if stage}
				<div class="stage-data-controls">
					<label><input type="checkbox" bind:checked={cameraUnlocked} /> free camera</label>
					<div class="control">
						<input type="range" bind:value={playerStrength} min={0} max={10} step={0.1} />
						<label> <input type="number" bind:value={playerStrength} /> player strength</label>
					</div>
					<div class="control">
						<input type="range" bind:value={playerSpeed} min={0} max={10} step={0.1} />
						<label> <input type="number" bind:value={playerSpeed} /> player speed</label>
					</div>
					<div class="control">
						<input type="range" bind:value={timeDilation} min={0} max={10} step={0.1} />
						<label> <input type="number" bind:value={timeDilation} /> time dilation</label>
					</div>
					<div class="buttons">
						<button
							title="[Spacebar] Reset the simulation"
							aria-label="Reset the simulation"
							on:click={resetStage}>⏮</button
						>
						<button
							title="[Backtick] {running ? 'Pause the simulation' : 'Play the simulation'}"
							aria-label={running ? 'Pause the simulation' : 'Play the simulation'}
							on:click={() => clock.toggle()}
							>{#if running}⏸{:else}▶️{/if}</button
						>
						<button
							title="[]] Simulate 1 tick"
							aria-label="Simulate 1 tick"
							on:click={() => simulate(1)}>→</button
						>
						<button
							title="[ctrl+]] Simulate 10 ticks"
							aria-label="Simulate 10 ticks"
							on:click={() => simulate(10)}>↠</button
						>
						<button
							title="[shift+]] Simulate 100 ticks"
							aria-label="Simulate 100 ticks"
							on:click={() => simulate(100)}>⇶</button
						>
					</div>
				</div>
				<slot />
			{/if}
		</div>
	{/if}
	<div class="main-controls">
		<button
			on:click={toggleExpandControls}
			aria-label={expandControls ? 'Hide controls' : 'Show controls'}
			title="[Escape] {expandControls ? 'Hide controls' : 'Show controls'}"
			>{#if expandControls}-{:else}+{/if}</button
		>
		{#if expandControls}
			<button title="Import JSON data" on:click={importData}>import</button>
			<button title="[ctrl+s] Save to localStorage" on:click={saveData}>save</button>
		{/if}
	</div>
</div>

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
		width: 100%;
		z-index: 1;
		display: flex;
		justify-content: flex-end;
	}
	.control {
		display: flex;
		align-items: center;
	}
	.stage-data-controls-wrapper {
		display: flex;
		align-items: flex-start;
		flex: 1;
	}
	.stage-data-controls {
		display: flex;
		flex-direction: column;
	}
	.main-controls {
		display: flex;
		flex-direction: column;
	}
	.buttons {
		display: flex;
	}
	.buttons button {
		font-size: var(--font_size_lg);
	}
	input[type='number'] {
		width: 50px;
		background: transparent;
		color: var(--text_color);
	}
</style>
