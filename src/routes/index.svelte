<script lang="ts">
	import {tick} from 'svelte';
	import {wait} from '@feltcoop/felt';
	import {EMPTY_ARRAY} from '@feltcoop/felt/util/array.js';
	import PendingAnimation from '@feltcoop/felt/ui/PendingAnimation.svelte';
	import {dequal} from 'dequal/lite';

	import PortalPreview from '$lib/portals/home/PortalPreview.svelte';
	import aboutPortal from '$lib/portals/about/data';
	import soggyPlanetPortal from '$lib/portals/soggy-planet/data';
	import starlitHammockPortal from '$lib/portals/starlit-hammock/data';
	import paintFreqsPortal from '$lib/portals/paint-freqs/data';
	import easings2Portal from '$lib/portals/easings-2/data';
	import easings1Portal from '$lib/portals/easings-1/data';
	import hearingTestPortal from '$lib/portals/hearing-test/data';
	import underConstructionPortal from '$lib/portals/under-construction/data';
	import freqSpeedsPortal from '$lib/portals/freq-speeds/data';
	import strengthBooster2Portal from '$lib/portals/secret2/data';
	import strengthBooster3Portal from '$lib/portals/secret3/data';
	import clocksPortal from '$lib/portals/clocks/data';
	import freqSpectaclePortal from '$lib/portals/freq-spectacle/data';
	import {getSettings} from '$lib/app/settings';
	import StarshipStage from '$lib/portals/home/StarshipStage.svelte';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import StarshipStageScore from '$lib/portals/home/StarshipStageScore.svelte';
	import GravityUnlockPortalPreview from '$lib/portals/gravity-unlock/Preview.svelte';
	import {browser} from '$app/env';
	import {getClock} from '$lib/app/clock';
	import {
		mergeScores,
		rescuedAllMoons,
		rescuedAnyCrew,
		Stage,
		type StarshipStageScores,
		rescuedAllCrew,
		rescuedAllCrewAtOnce,
	} from '$lib/portals/home/starshipStage';
	import {getDimensions} from '$lib/app/dimensions';
	import {toSongData} from '$lib/music/songs';
	import {goto} from '$app/navigation';
	import {pauseAudio} from '$lib/audio/playAudio';
	import {playSong} from '$lib/music/playSong';
	import {loadFromStorage, setInStorage} from '$lib/util/storage';
	import {
		STORAGE_KEY_STRENGTH_BOOSTER1,
		STORAGE_KEY_STRENGTH_BOOSTER2,
		STORAGE_KEY_STRENGTH_BOOSTER3,
	} from '$lib/portals/home/data';
	import type {PortalData} from '$lib/portals/portal';

	const dimensions = getDimensions();
	const clock = getClock();

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

	const settings = getSettings();

	const scrollDown = async (): Promise<void> => {
		await tick();
		window.scrollTo({left: window.scrollX, top: 9000, behavior: 'smooth'}); // `9000` bc `Infinity` doesn't work and I don't care to calculate it
	};

	let starshipMode = false;
	const TRANSITION_DURATION = 500;
	let transitioningStarshipModeCount = 0; // counter so it handles concurrent calls without much code
	$: transitioningStarshipMode = !!transitioningStarshipModeCount;
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
			worldWidth,
			worldHeight,
			viewWidth,
			viewHeight,
			viewportWidth,
			viewportHeight,
			data: {freezeCamera: !cameraUnlocked},
		});
	};
	const destroyStage = () => {
		if (!stage) return;
		stage.destroy();
		stage = null;
	};
	$: camera = stage?.camera;
	$: player = stage?.player;
	$: enableDomCanvasRenderer = $settings.devMode;

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
					typeof value.crewRescuedAtOnceCount !== 'number' ||
					isNaN(value.crewRescuedAtOnceCount) ||
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
	// TODO probably create a single scores object from this
	$: scoresRescuedAnyCrew = !!savedScores && rescuedAnyCrew(savedScores);
	$: scoresRescuedAllMoons = !!savedScores && rescuedAllMoons(savedScores);
	$: scoresRescuedAllCrew = !!savedScores && rescuedAllCrew(savedScores);
	$: scoresRescuedAllCrewAtOnce = !!savedScores && rescuedAllCrewAtOnce(savedScores);

	let finished = false;
	const finish = async (scores: StarshipStageScores | null): Promise<void> => {
		if (finished) return;
		if (!scores) return exitStarshipMode();
		finished = true;
		const finalScores = mergeScores(scores, savedScores);
		if (!dequal(finalScores, savedScores)) {
			setInStorage(STORAGE_KEY_SCORES, finalScores);
			savedScores = finalScores;
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
	const resetScores = () => {
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

	let pausedClock = false;
	const enterStarshipMode = async () => {
		if (starshipMode) return;
		console.log('enterStarshipMode');
		finished = false;
		starshipAngle = 0;
		starshipMode = true;
		pausedClock = $clock.running;
		if (pausedClock) clock.pause();
		clock.reset();
		transitioningStarshipModeCount++;
		await wait(TRANSITION_DURATION);
		transitioningStarshipModeCount--;
	};
	const exitStarshipMode = async () => {
		if (!starshipMode) return;
		console.log('exitStarshipMode');
		starshipAngle = 0;
		starshipMode = false;
		pauseAudio();
		if (pausedClock) clock.resume();
		transitioningStarshipModeCount++;
		await wait(TRANSITION_DURATION);
		transitioningStarshipModeCount--;
	};

	const onWindowKeydown = async (
		e: KeyboardEvent & {
			currentTarget: EventTarget & Window;
		},
	) => {
		// TODO integrate this with the controls in `__layout.svelte` and `World.svelte`
		// TODO controls for toggling the speed/strength boosters
		if (e.key === 'Escape' && !e.ctrlKey) {
			e.stopImmediatePropagation();
			e.preventDefault();
			if (e.ctrlKey) {
				await goto('/gravity-unlock');
			} else {
				if (!starshipMode) {
					await enterStarshipMode();
				} else {
					await exitStarshipMode();
				}
			}
		} else if (e.key === ' ') {
			if (starshipMode) {
				// && enableGlobalHotkeys(e.target)
				e.stopImmediatePropagation();
				e.preventDefault();
				void exitStarshipMode();
				await tick();
				await enterStarshipMode();
			}
		} else if (e.key === 'F2') {
			e.stopImmediatePropagation();
			e.preventDefault();
			if (e.ctrlKey) {
				resetScores();
				finished = false;
			} else if (starshipMode) {
				clock.pause();
				if ($currentStageScores) await finish($currentStageScores);
			}
		} else if (e.key === '1' && e.ctrlKey) {
			e.stopImmediatePropagation();
			e.preventDefault();
			await playSong(toSongData('Spacey Intro'));
		} else if (e.key === '2' && e.ctrlKey) {
			e.stopImmediatePropagation();
			e.preventDefault();
			await playSong(toSongData('Spacey Outro'));
		} else if (e.key === '3' && e.ctrlKey) {
			e.stopImmediatePropagation();
			e.preventDefault();
			await playSong(toSongData('Futuristic 4'));
		} else if (e.key === '4' && e.ctrlKey) {
			e.stopImmediatePropagation();
			e.preventDefault();
			await playSong(toSongData('Futuristic 1'));
		}
	};
</script>

<svelte:window on:keydown={(e) => void onWindowKeydown(e)} />

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
		style:transition={starshipReady ? 'none' : `transform ${TRANSITION_DURATION}ms ease-in-out`}
	>
		<header class="portals">
			<PortalPreview href={aboutPortal.slug} classes="portal-preview--{aboutPortal.slug}">
				<svelte:component this={aboutPortal.Preview} />
			</PortalPreview>
		</header>
		{#if savedScores}
			<GravityUnlockPortalPreview
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
			<ul class="portals">
				{#each portals as portal (portal)}
					{#if portal === starshipPortal}
						<PortalPreview onClick={enterStarshipMode} classes="portal-preview--starship"
							><div class="starship">🛸</div></PortalPreview
						>
					{:else}
						<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
							<svelte:component this={portal.Preview} />
						</PortalPreview>
					{/if}
				{/each}
			</ul>
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
							style="width: 100px; height: 100px;"
							class="mr-2"
						/>
					{:else if index === 1}
						<img
							src="/assets/earth/night_lights_2.png"
							alt="night lights of the Americas"
							style="width: 100px; height: 100px;"
							class="mr-2"
						/>
					{:else}
						<img
							src="/assets/earth/night_lights_3.png"
							alt="night lights of Asia and Australia"
							style="width: 100px; height: 100px;"
						/>
					{/if}
				</PendingAnimation>
			</PortalPreview>
		{/if}
		{#if strengthBoosterToggled}
			{#each secondaryPortals as portals}
				<ul class="portals strength-portals">
					{#each portals as portal}
						<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
							<svelte:component this={portal.Preview} />
						</PortalPreview>
					{/each}
				</ul>
			{/each}
		{/if}
		{#if speedBoosterUnlocked}
			<ul class="portals">
				<PortalPreview onClick={toggleSpeedBooster}
					><span class="booster" class:disabled={!speedBoosterEnabled}>{BOOSTER_SYMBOL}</span
					></PortalPreview
				>
			</ul>
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
					style="font-size: var(--font_size_xl3)"
				>
					{#if $currentStageScores && rescuedAnyCrew($currentStageScores)}{BOOSTER_SYMBOL}{:else}↩{/if}
				</FloatingIconButton>
				<StarshipStageScore scores={currentStageScores} />
			</div>
		{/if}
	{/if}
</div>

<style>
	.home {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		overflow: hidden; /* hide x overflow during transition and y overflow in `starshipMode` */
	}
	.home.starship-mode,
	.home.starship-transitioning {
		/* hide the vertical scrollbar */
		height: 100%;
	}
	header {
		margin-top: 15px;
	}
	.portals {
		width: 100%;
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
		user-select: none;
	}
	.starship {
		font-size: 84px;
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
</style>
