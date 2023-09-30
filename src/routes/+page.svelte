<script lang="ts">
	import {tick} from 'svelte';
	import {wait} from '@grogarden/util/async.js';
	import {EMPTY_ARRAY} from '@grogarden/util/array.js';
	import PendingAnimation from '@fuz.dev/fuz_library/PendingAnimation.svelte';
	import {dequal} from 'dequal/lite';
	import {swallow} from '@grogarden/util/dom.js';
	import {browser} from '$app/environment';

	import {get_clock} from '$lib/dealt/flat/clock.js';
	import {enable_global_hotkeys} from '$lib/dealt/flat/dom.js';
	import {get_dimensions} from '$lib/dimensions.js';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
	import StarshipPreview from '$routes/Preview.svelte';
	import aboutPortal from '$routes/about/data';
	import soggyPlanetPortal from '$routes/soggy-planet/data';
	import starlitHammockPortal from '$routes/starlit-hammock/data';
	import paintFreqsPortal from '$routes/paint-freqs/data';
	import easings2Portal from '$routes/easings-2/data';
	import easings1Portal from '$routes/easings-1/data';
	import hearingTestPortal from '$routes/hearing-test/data';
	import underConstructionPortal from '$routes/under-construction/data';
	import freqSpeedsPortal from '$routes/freq-speeds/data';
	import strengthBooster2Portal from '$routes/secret2/data';
	import strengthBooster3Portal from '$routes/secret3/data';
	import clocksPortal from '$routes/clocks/data';
	import freqSpectaclePortal from '$routes/freq-spectacle/data';
	import {get_settings} from '$lib/app/settings';
	import StarshipStage from '$routes/StarshipStage.svelte';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import StarshipStageScore from '$routes/StarshipStageScore.svelte';
	import UnlockPortalPreview from '$routes/unlock/Preview.svelte';
	import StarshipMenu from '$routes/StarshipMenu.svelte';
	import AppDialog from '$lib/app/AppDialog.svelte';
	import {
		mergeScores,
		rescuedAllMoons,
		rescuedAnyCrew,
		Stage,
		type StarshipStageScores,
		parseStarshipStageScores,
		rescuedAllCrew,
		rescuedAllCrewAtOnce,
		toInitialScores,
	} from '$routes/starshipStage';
	import {lookup_song} from '$lib/music/songs';
	import {play_song} from '$lib/music/play_song';
	import {loadFromStorage, setInStorage} from '$lib/util/storage';
	import {
		STORAGE_KEY_STRENGTH_BOOSTER1,
		STORAGE_KEY_STRENGTH_BOOSTER2,
		STORAGE_KEY_STRENGTH_BOOSTER3,
	} from '$routes/data';
	import type {PortalData} from '$lib/app/portal';
	import {scrollDown} from '$lib/util/dom';
	import {show_app_dialog} from '$lib/app/appDialog';

	const dimensions = get_dimensions();
	const clock = get_clock();

	let strengthBooster1Enabled = loadFromStorage(STORAGE_KEY_STRENGTH_BOOSTER1, false);
	let strengthBooster2Enabled = loadFromStorage(STORAGE_KEY_STRENGTH_BOOSTER2, false);
	let strengthBooster3Enabled = loadFromStorage(STORAGE_KEY_STRENGTH_BOOSTER3, false);

	$: ({width: viewportWidth, height: viewportHeight} = $dimensions);

	const DEFAULT_WORLD_DIMENSIONS = {width: 2560, height: 1440};

	// TODO should we pass through plain numbers or a dimensions object?
	// // TODO what about the camera zoom relative to what can fit in the dimensions?
	let viewWidth: number;
	let viewHeight: number;
	let worldWidth: number;
	let worldHeight: number;
	$: viewScale = viewWidth / worldWidth; // this is the same for X and Y as currently calculated, aspect ratio is preserved
	// TODO make this a helper to clarify the deps `update_dimensions`
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

	const starshipPortal: any = Symbol();

	const primaryPortals: PortalData[][] = [
		[soggyPlanetPortal],
		[starlitHammockPortal],
		[easings2Portal, paintFreqsPortal, easings1Portal],
		[starshipPortal, hearingTestPortal, underConstructionPortal],
	];
	let secondaryPortals: PortalData[][];
	$: secondaryPortals = [
		[
			...(strengthBooster2Enabled ? [strengthBooster2Portal] : EMPTY_ARRAY),
			...(strengthBooster1Enabled ? [freqSpeedsPortal] : EMPTY_ARRAY),
			clocksPortal,
			...(strengthBooster1Enabled ? [freqSpectaclePortal] : EMPTY_ARRAY),
			...(strengthBooster3Enabled ? [strengthBooster3Portal] : EMPTY_ARRAY),
		],
	];

	const settings = get_settings();

	let exitStarshipModeCount = 0;

	let starshipMode = false;
	const TRANSITION_DURATION = 500;
	// slow transition the first time -- TODO and play music?
	$: transitionDuration =
		savedScores || exitStarshipModeCount > 1 ? TRANSITION_DURATION : TRANSITION_DURATION * 1;
	let transitioningStarshipModeCount = 0; // counter so it handles concurrent calls without much code
	// TODO disable input while transitioning?
	$: transitioningStarshipMode = transitioningStarshipModeCount > 0;
	$: starshipReady = starshipMode && !transitioningStarshipMode;

	let starshipX = 0;
	let starshipY = 0;
	let starshipAngle = 0;
	let starshipShieldRadius = 0;
	let stage: Stage | null = null;
	$: {
		destroyStage();
		if (starshipMode) createStage();
	}
	const createStage = () => {
		stage = new Stage({
			exit: (outcome) => console.log('exited stage', outcome), // TODO refactor with `finish` below
			worldWidth,
			worldHeight,
			viewWidth,
			viewHeight,
			viewportWidth,
			viewportHeight,
			data: {freezeCamera: !cameraUnlocked},
		});
		if (!savedScores) {
			initialScores = toInitialScores(stage);
			saveScores(initialScores);
		}
	};
	const destroyStage = () => {
		if (!stage) return;
		stage.destroy();
		stage = null;
	};
	$: camera = stage?.camera;
	$: player = stage?.player;
	$: enableDomCanvasRenderer = $settings.dev_mode;

	$: starshipRotation = starshipAngle + Math.PI / 2;

	// TODO extract to a custom store
	const STORAGE_KEY_SCORES = 'cpg_home_scores';
	const loadScores = (): StarshipStageScores | undefined => {
		if (!browser) return undefined;
		return loadFromStorage<StarshipStageScores | undefined>(
			STORAGE_KEY_SCORES,
			undefined,
			(value) => {
				// TODO better validation, how? zod parser?
				if (
					!value ||
					typeof value.crew_rescued_at_once_count !== 'number' ||
					isNaN(value.crew_rescued_at_once_count) ||
					!Array.isArray(value.crew) ||
					!value.crew.every((v: any) => typeof v === 'boolean')
				) {
					throw Error();
				}
			},
		);
	};
	// TODO refactor these into a single store that handles saving/loading
	$: currentStageScores = stage?.scores;
	let savedScores = loadScores();
	let initialScores: StarshipStageScores | undefined;
	// TODO probably create a single scores object from this
	$: scoresRescuedAnyCrew = !!savedScores && rescuedAnyCrew(savedScores);
	$: scoresRescuedAllMoons = !!savedScores && rescuedAllMoons(savedScores);
	$: scoresRescuedAllCrew = !!savedScores && rescuedAllCrew(savedScores);
	$: scoresRescuedAllCrewAtOnce = !!savedScores && rescuedAllCrewAtOnce(savedScores);
	const saveScores = (scores: StarshipStageScores): boolean => {
		if (dequal(scores, savedScores)) return false;
		setInStorage(STORAGE_KEY_SCORES, scores);
		savedScores = scores;
		return true;
	};

	// TODO refactor with `exit` above
	let finished = false;
	const finish = async (scores: StarshipStageScores | null): Promise<void> => {
		if (finished) return;
		if (!scores) return exitStarshipMode();
		finished = true;
		const finalScores = mergeScores(scores, savedScores);
		if (saveScores(finalScores)) {
			// TODO this is very messy and duplicative but I'm not sure how to do this reactively,
			// probably need to restructure some things
			if (!scoresRescuedAnyCrew && rescuedAnyCrew(finalScores)) {
				toggleSpeedBooster();
			}
			if (!scoresRescuedAllCrew && rescuedAllCrew(finalScores)) {
				await toggleStrengthBooster();
			}
		}
	};
	// TODO refactor, `ScoresManager` component?
	const resetScores = () => {
		if (!confirm('delete all scores?')) return; // eslint-disable-line no-alert

		setInStorage(STORAGE_KEY_SCORES, undefined);
		savedScores = undefined;

		setInStorage(STORAGE_KEY_SPEED_BOOSTER_TOGGLED, false);
		speedBoosterToggled = false;

		setInStorage(STORAGE_KEY_STRENGTH_BOOSTER_TOGGLED, false);
		strengthBoosterToggled = false;

		setInStorage(STORAGE_KEY_STRENGTH_BOOSTER1, false);
		strengthBooster1Enabled = false;

		setInStorage(STORAGE_KEY_STRENGTH_BOOSTER2, false);
		strengthBooster2Enabled = false;

		setInStorage(STORAGE_KEY_STRENGTH_BOOSTER3, false);
		strengthBooster3Enabled = false;
	};
	const importScores = (): void => {
		// eslint-disable-next-line no-alert
		const newScoresRaw = prompt(
			'import scores',
			savedScores
				? JSON.stringify(savedScores)
				: initialScores
				? JSON.stringify(initialScores)
				: undefined,
		)?.trim();
		if (newScoresRaw === '') {
			if (initialScores) {
				saveScores(initialScores);
			} else {
				resetScores();
			}
		} else {
			try {
				const parsed =
					newScoresRaw === undefined ? undefined : parseStarshipStageScores(newScoresRaw);
				if (parsed) {
					saveScores(parsed);
				}
			} catch (err) {
				alert('failed to parse scores: ' + err); // eslint-disable-line no-alert
			}
		}
	};

	const STORAGE_KEY_SPEED_BOOSTER_TOGGLED = 'cpg_speed_booster_toggled';
	const BOOSTER_SYMBOL = '🙌';
	let speedBoosterToggled = loadFromStorage(STORAGE_KEY_SPEED_BOOSTER_TOGGLED, false);
	$: setInStorage(STORAGE_KEY_SPEED_BOOSTER_TOGGLED, !!speedBoosterToggled); // TODO unnecessary first run
	$: speedBoosterUnlocked = scoresRescuedAnyCrew;
	$: speedBoosterEnabled = speedBoosterUnlocked && speedBoosterToggled;
	const toggleSpeedBooster = () => {
		speedBoosterToggled = !speedBoosterToggled;
	};

	const STORAGE_KEY_STRENGTH_BOOSTER_TOGGLED = 'cpg_strength_booster_toggled';
	let strengthBoosterToggled = loadFromStorage(STORAGE_KEY_STRENGTH_BOOSTER_TOGGLED, false);
	$: setInStorage(STORAGE_KEY_STRENGTH_BOOSTER_TOGGLED, !!strengthBoosterToggled); // TODO unnecessary first run
	$: strengthBoosterUnlocked = scoresRescuedAllCrew;
	$: strengthBoosterEnabled = strengthBoosterUnlocked && strengthBoosterToggled;
	const toggleStrengthBooster = async () => {
		strengthBoosterToggled = !strengthBoosterToggled;
		if (strengthBoosterToggled) await scrollDown();
	};

	$: cameraUnlocked = scoresRescuedAllMoons;

	let starshipHeight: number;

	$: starshipScale = player ? ((player.radius * 2) / starshipHeight) * viewScale : 1; // TODO isn't reactive to player radius
	$: starshipViewX = ($camera ? (starshipX - $camera.x) * $camera.scale : starshipX) * viewScale;
	$: starshipViewY = $camera
		? (starshipY - $camera.y) * $camera.scale * viewScale - (starshipHeight - viewportHeight) / 2
		: starshipY - (starshipHeight - viewportHeight) / 2;

	const enterStarshipMode = async () => {
		if (starshipMode) return;
		console.log('enterStarshipMode');
		finished = false;
		starshipAngle = 0;
		starshipMode = true;
		clock.pause();
		clock.reset();
		$show_app_dialog = false;
		transitioningStarshipModeCount++;
		await wait(transitionDuration + 50); // trying to avoid glitchy horizontal scrollbar that sometimes appears
		transitioningStarshipModeCount--;
	};
	const exitStarshipMode = async () => {
		if (!starshipMode) return;
		console.log('exitStarshipMode');
		starshipAngle = 0;
		starshipMode = false;
		clock.resume();
		$show_app_dialog = false;
		transitioningStarshipModeCount++;
		await wait(transitionDuration + 50); // trying to avoid glitchy horizontal scrollbar that sometimes appears
		transitioningStarshipModeCount--;
		exitStarshipModeCount++;
	};
	const toggleStarshipMode = () => (starshipMode ? exitStarshipMode() : enterStarshipMode());
	const toggleStarshipMenu = () => ($show_app_dialog = true);

	const keydown = async (
		e: KeyboardEvent & {
			currentTarget: EventTarget & Window;
		},
	) => {
		// TODO integrate this with the controls in `__layout.svelte` and `World.svelte`
		// TODO controls for toggling the speed/strength boosters
		if (e.key === ' ' && !e.ctrlKey && enable_global_hotkeys(e.currentTarget)) {
			swallow(e);
			await toggleStarshipMode();
		} else if (e.key === 'r' && !e.ctrlKey && enable_global_hotkeys(e.currentTarget)) {
			swallow(e);
			void exitStarshipMode();
			await tick();
			await enterStarshipMode();
		} else if (e.key === 'F2') {
			swallow(e);
			if (e.ctrlKey) {
				resetScores();
				finished = false;
			} else if (starshipMode) {
				clock.pause();
				if ($currentStageScores) await finish($currentStageScores);
			}
		} else if (e.key === '1' && e.ctrlKey) {
			// TODO change/move these
			swallow(e);
			await play_song(lookup_song('Spacey Intro'));
		} else if (e.key === '2' && e.ctrlKey) {
			swallow(e);
			await play_song(lookup_song('Spacey Outro'));
		} else if (e.key === '3' && e.ctrlKey) {
			swallow(e);
			await play_song(lookup_song('Futuristic 4'));
		} else if (e.key === '4' && e.ctrlKey) {
			swallow(e);
			await play_song(lookup_song('Futuristic 1'));
		}
	};
</script>

<svelte:window on:keydown={keydown} />

<div
	class="home"
	class:starship-mode={starshipMode}
	class:starship-ready={starshipReady}
	class:starship-transitioning={transitioningStarshipMode}
>
	<nav
		bind:clientHeight={starshipHeight}
		style:transform={starshipMode
			? `translate3d(${starshipViewX}px, ${starshipViewY}px,	0) scale3d(${starshipScale}, ${starshipScale}, ${starshipScale})	rotate(${starshipRotation}rad)`
			: 'none'}
		style:transition={starshipReady ? 'none' : `transform ${transitionDuration}ms ease-in-out`}
	>
		<header class="portals">
			<PortalPreview href={aboutPortal.slug} classes="portal-preview--{aboutPortal.slug}">
				<svelte:component this={aboutPortal.Preview} />
			</PortalPreview>
		</header>
		{#if savedScores}
			<UnlockPortalPreview
				unlocked={scoresRescuedAllCrewAtOnce}
				scores={savedScores}
				onClick={scoresRescuedAllCrewAtOnce
					? undefined
					: async () => {
							if (!starshipMode) {
								await enterStarshipMode();
							}
					  }}
			/>
		{/if}
		{#each primaryPortals as portals}
			<div class="portals">
				{#each portals as portal (portal)}
					{#if portal === starshipPortal}
						<StarshipPreview onClick={toggleStarshipMenu} classes="portal-preview--starship" />
					{:else}
						<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
							<svelte:component this={portal.Preview} />
						</PortalPreview>
					{/if}
				{/each}
			</div>
		{/each}
		{#if strengthBoosterUnlocked}
			<PortalPreview classes="show-more-button" onClick={() => void toggleStrengthBooster()}>
				<PendingAnimation
					running={strengthBoosterToggled && $clock.running}
					let:index
					--animation_duration="var(--duration_6)"
				>
					{#if index === 0}
						<img
							src="/assets/earth/night_lights_1.png"
							alt="night lights of Africa, Europe, and the Middle East"
							class="night-light"
						/>
					{:else if index === 1}
						<img
							src="/assets/earth/night_lights_2.png"
							alt="night lights of the Americas"
							class="night-light"
						/>
					{:else}
						<img
							src="/assets/earth/night_lights_3.png"
							alt="night lights of Asia and Australia"
							class="night-light"
						/>
					{/if}
				</PendingAnimation>
			</PortalPreview>
		{/if}
		{#if strengthBoosterToggled}
			{#each secondaryPortals as portals}
				<div class="portals strength-portals">
					{#each portals as portal}
						<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
							<svelte:component this={portal.Preview} />
						</PortalPreview>
					{/each}
				</div>
			{/each}
		{/if}
		{#if speedBoosterUnlocked}
			<div class="portals">
				<PortalPreview onClick={toggleSpeedBooster}
					><span class="booster" class:disabled={!speedBoosterEnabled}>{BOOSTER_SYMBOL}</span
					></PortalPreview
				>
			</div>
		{/if}
	</nav>
	{#if stage}
		<StarshipStage
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
			{finish}
			{enableDomCanvasRenderer}
		/>
		{#if finished}
			<div class="exit">
				<FloatingIconButton
					label="return home"
					on:click={() => exitStarshipMode()}
					style="font-size: var(--size_xl9)"
				>
					{#if $currentStageScores && rescuedAnyCrew($currentStageScores)}{BOOSTER_SYMBOL}{:else}↩{/if}
				</FloatingIconButton>
				<StarshipStageScore scores={currentStageScores && $currentStageScores} />
			</div>
		{/if}
	{/if}
</div>
<AppDialog let:exit>
	<StarshipMenu
		{clock}
		{exit}
		{starshipMode}
		{toggleStarshipMode}
		scores={savedScores}
		resetScores={savedScores ? resetScores : undefined}
		{importScores}
	/>
</AppDialog>

<style>
	.home {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
	}
	.home.starship-mode,
	.home.starship-transitioning {
		/* hide the vertical scrollbar */
		height: 100%;
		overflow: hidden; /* hide x overflow during transition and y overflow in `starshipMode` */
	}
	header {
		margin-top: 15px;
	}
	.portals {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
	.strength-portals {
		position: relative;
	}
	.starship-mode .portals {
		flex-wrap: nowrap;
	}
	.booster {
		font-size: 144px;
		transform: rotate3d(1, 0, 0, 180deg);
	}
	nav {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%; /* allows nesting without shared rows to let the toggle stay still */
	}
	.starship-mode nav {
		-webkit-user-select: none;
		user-select: none;
	}

	/* TODO not sure about this name */
	.disabled {
		filter: grayscale();
		opacity: 0.4;
	}

	:global(.show-more-button) {
		padding: var(--portal_padding);
	}

	/* TODO how to do this? data with a css variable?
	or is this the right time to add CSS variables to JS? */
	:global(.portal-preview--soggy-planet) {
		border-color: var(--ocean_color) !important;
	}
	:global(.portal-preview--starlit-hammock) {
		border-color: var(--space_color) !important;
	}
	:global(.portal-preview--starship) {
		border-color: var(--photon_color) !important;
	}
	.exit {
		position: fixed;
		left: 0;
		top: 0;
		transform: translate3d(calc(100vw / 2 - 50%), calc(100vh / 2 - 50%), 0);
		display: flex;
		flex-direction: column;
		align-items: center;
		/* TODO hacky -- maybe `.opaque` or remove transparency from the FloatingIconButton or make it a prop?  */
		--hud_element_size: 200px;
		--clickable_opacity: 1;
		--clickable_opacity__hover: 1;
		--clickable_opacity__active: 1;
	}
	.night-light {
		width: 100px;
		height: 100px;
		margin-right: var(--spacing-2);
	}
	.night-light:last-child {
		margin-right: 0;
	}
</style>
