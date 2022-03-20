<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {onMount, onDestroy} from 'svelte';

	import Canvas from '$lib/flat/Canvas.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {CanvasRenderer} from '$lib/flat/CanvasRenderer';
	import {Controller} from '$lib/flat/Controller';
	import type {StageState} from '$lib/flat/stageState';
	import type {StageConstructor, ExitStage} from '$lib/flat/stage';

	export let width: number;
	export let height: number;
	export let stages: StageConstructor[];
	export let renderer = new CanvasRenderer();
	export let controller = new Controller();

	$: ({dirty} = renderer);
	$: ({moving} = controller);

	const clock = getClock();

	// TODO this is at odds with `settingUp` -- should `started` be reset on `setActiveStage`?
	$: if (!$clock.running && $moving) clock.resume();

	// TODO take the `StageState` object as an arg
	const onExitStage: ExitStage = async (outcome): Promise<void> => {
		console.log('onExitStage outcome', outcome);
		const next_stage_name = outcome?.next_stage || stages[0].meta.name;
		const unlock = outcome?.unlock;
		if (unlock && activeStageState) {
			// TODO just chooses the next stage, need pluggable algorithms
			const activeStageIndex = $stageStates.indexOf(activeStageState);
			stageStates.update(($stageStates) => {
				const nextStageStates = $stageStates.slice();
				const activeStageState = {...$stageStates[activeStageIndex]};
				activeStageState.completions = activeStageState.completions.concat({
					time: activeStageState.stage!.time,
				});
				if (unlock) {
					for (const unlockedStageName of unlock) {
						const index = $stageStates.findIndex(
							(s) => s.stageConstructor.meta.name === unlockedStageName,
						);
						$stageStates[index] = {...$stageStates[index], unlocked: true};
					}
				}
				return nextStageStates;
			});
		}
		const nextStageState = $stageStates.find(
			(s) => s.stageConstructor.meta.name === next_stage_name,
		);
		if (!nextStageState) throw Error(`Unknown stage: ${next_stage_name}`);
		await setActiveStage(nextStageState);
	};

	// TODO persist to localstorage
	// TODO reactive to `stages`
	export const stageStates: Writable<StageState[]> = writable(
		stages.map((stageConstructor, i) => ({
			stageConstructor,
			stage: i === 0 ? new stageConstructor(controller, onExitStage) : null, // TODO initialize from saved state
			unlocked: i === 0,
			completions: [],
		})),
	);
	$: console.log('changed $stageStates', $stageStates);

	export let activeStageState: StageState | null = null;
	$: console.log('activeStageState', activeStageState);
	let settingUp = false;
	export const setActiveStage = async (stageState: StageState = $stageStates[0]): Promise<void> => {
		console.log('setActiveStage stageState', {activeStageState, stageState});
		settingUp = true;
		if (activeStageState?.stage) {
			await activeStageState.stage.teardown();
			stageStates.update(($stageStates) => {
				const nextStageStates = $stageStates.slice();
				// TODO can we use `indexOf` or are there cases where the ref would be different?
				const activeIndex = $stageStates.findIndex(
					($s) => $s.stageConstructor === activeStageState!.stageConstructor,
				);
				nextStageStates[activeIndex] = {...activeStageState!, stage: null};
				return nextStageStates;
			});
		}
		stageStates.update(($stageStates) => {
			// TODO speed this up with better data structures
			const nextStageStates = $stageStates.slice();
			// TODO can we use `indexOf` or are there cases where the ref would be different?
			const activeIndex = $stageStates.findIndex(
				($s) => $s.stageConstructor === stageState.stageConstructor,
			);
			nextStageStates[activeIndex] = {
				...stageState,
				stage: new stageState.stageConstructor(controller, onExitStage),
			};
			return nextStageStates;
		});
		activeStageState = $stageStates.find(
			($s) => $s.stageConstructor === stageState.stageConstructor,
		)!;
		console.log('setting up', activeStageState, $stageStates.indexOf(activeStageState));
		await activeStageState.stage!.setup({
			stageStates: $stageStates,
			seed: Math.random(),
			width,
			height,
		});
		console.log('all set up!');
		settingUp = false; // TODO refactor
	};

	onMount(async () => {
		await setActiveStage();
	});
	onDestroy(async () => {
		await activeStageState?.stage?.teardown();
	});

	// TODO maybe simplify this logic and render after `setActiveStage`?
	$: if (($clock.running || $dirty) && renderer.ctx && activeStageState && !settingUp) {
		if ($clock.running) {
			activeStageState.stage!.update($clock.dt);
		}
		activeStageState.stage!.render(renderer);
	}

	// TODO actions
	const onKeydown = (e: KeyboardEvent) => {
		controller.handleKeydown(e.key);
	};
	const onKeyup = (e: KeyboardEvent) => {
		controller.handleKeyup(e.key);
	};
</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} />

<div class="world" style:width="{width}px" style:height="{height}px">
	{#if activeStageState?.stage}
		<Canvas {width} {height} stage={activeStageState.stage} {renderer} />
	{:else}
		<!-- TODO loading -- do nothing? -->
	{/if}
</div>

<style>
	.world {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
