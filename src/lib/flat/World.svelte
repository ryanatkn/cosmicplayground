<script lang="ts">
	import {writable, type Writable} from 'svelte/store';
	import {produce} from 'immer';
	import {onMount} from 'svelte';

	import Canvas from '$lib/flat/Canvas.svelte';
	import InteractiveSurface from '$lib/flat/InteractiveSurface.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {CanvasRenderer} from '$lib/flat/CanvasRenderer';
	import {Controller} from '$lib/flat/Controller';
	import {type StageState} from '$lib/flat/stageState';
	import {type StageConstructor, type ExitStage} from '$lib/flat/stage';

	export let height: number;
	export let width: number;
	export let stages: StageConstructor[];
	export let renderer = new CanvasRenderer();
	export let controller = new Controller();

	$: ({dirty} = renderer);

	const clock = getClock();

	// TODO take the `StageState` object as an arg
	const onExitStage: ExitStage = async (outcome): Promise<void> => {
		console.log('onExitStage outcome', outcome);
		const next_stage_name = outcome?.next_stage || stages[0].meta.name;
		const unlock = outcome?.unlock;
		if (unlock && activeStageState) {
			// TODO just chooses the next stage, need pluggable algorithms
			const active_stage_index = $stageStates.indexOf(activeStageState);
			stageStates.update(($v) =>
				produce($v, ($stageStates) => {
					const activeStageState = $stageStates[active_stage_index];
					activeStageState.completions.push({time: activeStageState.stage!.time});
					if (unlock) {
						for (const unlocked_stage_name of unlock) {
							console.log('unlocked_stage_name', unlocked_stage_name);
							// TODO just chooses the next stage, need pluggable algorithms
							const unlocked_stageState = $stageStates.find(
								(s) => s.stageConstructor.meta.name === unlocked_stage_name,
							);
							unlocked_stageState!.unlocked = true;
						}
					}
				}),
			);
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
			stageStates.update(($v) =>
				produce($v, ($stageStates) => {
					const activeIndex = $stageStates.findIndex(
						($s) => $s.stageConstructor === activeStageState!.stageConstructor,
					);
					$stageStates[activeIndex].stage = null;
				}),
			);
		}
		// TODO check for existing stage to teardown?
		stageStates.update(($v) =>
			produce($v, ($stageStates) => {
				// TODO speed this up with better data structures
				const activeIndex = $stageStates.findIndex(
					($s) => $s.stageConstructor === stageState.stageConstructor,
				);
				$stageStates[activeIndex].stage = new stageState.stageConstructor(controller, onExitStage);
				console.log('new', $stageStates[activeIndex].stage, activeIndex);
			}),
		);
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

	$: if (($clock.running || $dirty) && renderer.ctx && activeStageState && !settingUp) {
		if ($clock.running) {
			activeStageState.stage!.update($clock.dt);
		}
		activeStageState.stage!.render(renderer);
	}

	// TODO actions
	const onKeydown = (e: KeyboardEvent) => {
		controller.handleKeydown(e.key);
		// TODO extract to top level (controller in context?)
		if (controller.pressingPause) {
			clock.toggle();
		}
	};
	const onKeyup = (e: KeyboardEvent) => {
		controller.handleKeyup(e.key);
	};
</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} />

<!-- TODO maybe instead use ResizeObserver? the iframe measuring feels unfortunate -->
<div class="world" style:width={width + 'px'} style:height={height + 'px'}>
	{#if !activeStageState?.stage}
		<!-- TODO loading -- do nothing? -->
	{:else}
		<Canvas {width} {height} stage={activeStageState.stage} {renderer} />
		<InteractiveSurface {width} {height} controller={activeStageState.stage.controller} />
		<slot />
	{/if}
</div>

<style>
	.world {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
	}
</style>
