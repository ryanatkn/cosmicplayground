<script lang="ts">
	import {tick} from 'svelte';
	import {wait} from '@ryanatkn/belt/async.js';
	import {EMPTY_ARRAY} from '@ryanatkn/belt/array.js';
	import Pending_Animation from '@ryanatkn/fuz/Pending_Animation.svelte';
	import {dequal} from 'dequal/lite';
	import {swallow} from '@ryanatkn/belt/dom.js';
	import {BROWSER} from 'esm-env';

	import {clock_context} from '$lib/clock.js';
	import {enable_global_hotkeys} from '$lib/dom.js';
	import {get_dimensions} from '$lib/dimensions.js';
	import PortalPreview from '$lib/PortalPreview.svelte';
	import StarshipPreview from '$routes/Preview.svelte';
	import aboutPortal from '$routes/about/data.js';
	import soggyPlanetPortal from '$routes/soggy-planet/data.js';
	import starlitHammockPortal from '$routes/starlit-hammock/data.js';
	import paintFreqsPortal from '$routes/paint-freqs/data.js';
	import easings2Portal from '$routes/easings-2/data.js';
	import easings1Portal from '$routes/easings-1/data.js';
	import hearingTestPortal from '$routes/hearing-test/data.js';
	import underConstructionPortal from '$routes/under-construction/data.js';
	import freqSpeedsPortal from '$routes/freq-speeds/data.js';
	import strengthBooster2Portal from '$routes/secret2/data.js';
	import strengthBooster3Portal from '$routes/secret3/data.js';
	import clocksPortal from '$routes/clocks/data.js';
	import freqSpectaclePortal from '$routes/freq-spectacle/data.js';
	import {get_settings} from '$lib/settings.js';
	import StarshipStage from '$routes/StarshipStage.svelte';
	import FloatingIconButton from '$lib/FloatingIconButton.svelte';
	import StarshipStageScore from '$routes/StarshipStageScore.svelte';
	import UnlockPortalPreview from '$routes/unlock/Preview.svelte';
	import StarshipMenu from '$routes/StarshipMenu.svelte';
	import AppDialog from '$lib/AppDialog.svelte';
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
	} from '$routes/starshipStage.js';
	import {lookup_song} from '$lib/songs.js';
	import {play_song} from '$lib/play_song.js';
	import {loadFromStorage, setInStorage} from '$lib/storage.js';
	import {
		STORAGE_KEY_STRENGTH_BOOSTER1,
		STORAGE_KEY_STRENGTH_BOOSTER2,
		STORAGE_KEY_STRENGTH_BOOSTER3,
	} from '$routes/data.js';
	import type {PortalData} from '$lib/portal.js';
	import {scrollDown} from '$lib/dom.js';
	import {get_app_dialog} from '$lib/app_dialog.js';

	const app_dialog = get_app_dialog();

	const dimensions = get_dimensions();
	const clock = clock_context.get();

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
		if (!BROWSER) return undefined;
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
				toggle_speed_booster();
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
	$: speed_booster_unlocked = scoresRescuedAnyCrew;
	$: speed_booster_enabled = speed_booster_unlocked && speedBoosterToggled;
	const toggle_speed_booster = () => {
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
		app_dialog.close();
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
		app_dialog.close();
		transitioningStarshipModeCount++;
		await wait(transitionDuration + 50); // trying to avoid glitchy horizontal scrollbar that sometimes appears
		transitioningStarshipModeCount--;
		exitStarshipModeCount++;
	};
	const toggleStarshipMode = () => (starshipMode ? exitStarshipMode() : enterStarshipMode());
	const toggleStarshipMenu = () => app_dialog.open();

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
			<PortalPreview href={aboutPortal.slug} classes="portal_preview--{aboutPortal.slug}">
				<aboutPortal.Preview />
			</PortalPreview>
		</header>
		{#if savedScores}
			<UnlockPortalPreview
				unlocked={scoresRescuedAllCrewAtOnce}
				scores={savedScores}
				on_click={scoresRescuedAllCrewAtOnce
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
						<StarshipPreview on_click={toggleStarshipMenu} classes="portal_preview--starship" />
					{:else}
						<PortalPreview href={portal.slug} classes="portal_preview--{portal.slug}">
							<portal.Preview />
						</PortalPreview>
					{/if}
				{/each}
			</div>
		{/each}
		{#if strengthBoosterUnlocked}
			<PortalPreview classes="show-more-button" on_click={() => void toggleStrengthBooster()}>
				<Pending_Animation
					running={strengthBoosterToggled && $clock.running}
					--animation_duration="var(--duration_6)"
				>
					{#snippet children(index)}
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
					{/snippet}
				</Pending_Animation>
			</PortalPreview>
		{/if}
		{#if strengthBoosterToggled}
			{#each secondaryPortals as portals}
				<div class="portals strength-portals">
					{#each portals as portal}
						<PortalPreview href={portal.slug} classes="portal_preview--{portal.slug}">
							<portal.Preview />
						</PortalPreview>
					{/each}
				</div>
			{/each}
		{/if}
		{#if speed_booster_unlocked}
			<div class="portals">
				<PortalPreview
					on_click={toggle_speed_booster}
					role="checkbox"
					aria-label="speed booster"
					aria-checked={speed_booster_enabled}
				>
					<!-- TODO finish a11y - needs to be the button in `PortalPreview` that has these a11y properties -->
					<div class="booster" class:disabled={!speed_booster_enabled}>
						{BOOSTER_SYMBOL}
					</div></PortalPreview
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
			{speed_booster_enabled}
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
				<FloatingIconButton label="return home" onclick={() => exitStarshipMode()} class="size_xl9">
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
	:global(.portal_preview--soggy-planet) {
		border-color: var(--ocean_color) !important;
	}
	:global(.portal_preview--starlit-hammock) {
		border-color: var(--space_color) !important;
	}
	:global(.portal_preview--starship) {
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
		--clickable_opacity_hover: 1;
		--clickable_opacity_active: 1;
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
