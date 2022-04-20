<script lang="ts">
	import {tick} from 'svelte';
	import {wait} from '@feltcoop/felt';
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
	import transitionDesignerPortal from '$lib/portals/transition-designer/data';
	import clocksPortal from '$lib/portals/clocks/data';
	import freqSpectaclePortal from '$lib/portals/freq-spectacle/data';
	import {getSettings} from '$lib/app/settingsStore';
	import StarshipStage from '$lib/portals/home/StarshipStage.svelte';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import StarshipStageScore from '$lib/portals/home/StarshipStageScore.svelte';
	import {browser} from '$app/env';
	import {getClock} from '$lib/app/clockStore';
	import {
		MOON_ICONS,
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

	const dimensions = getDimensions();
	const clock = getClock();

	$: ({width: screenWidth, height: screenHeight} = $dimensions);

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
		// Expand the world dimensions to fit the screen dimensions.
		// It needs to match the screen aspect ratio and
		// cover the entire default world dimensions.
		viewWidth = screenWidth;
		viewHeight = screenHeight;
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
		const screenAspectRatio = screenWidth / screenHeight;
		viewWidth = (screenWidth * Math.min(1, worldAspectRatio / screenAspectRatio)) | 0;
		viewHeight = (screenHeight * Math.min(1, screenAspectRatio / worldAspectRatio)) | 0;
	}

	const starshipPortal = Symbol();

	const primaryPortals = [
		[soggyPlanetPortal],
		[starlitHammockPortal],
		[easings2Portal, paintFreqsPortal, easings1Portal],
		[starshipPortal as any, hearingTestPortal, underConstructionPortal],
	];
	const secondaryPortals = [
		[freqSpeedsPortal, transitionDesignerPortal, clocksPortal, freqSpectaclePortal],
	];

	const settings = getSettings();
	const toggleShowMorePortals = async () => {
		settings.update(($settings) => ({...$settings, showMorePortals: !$settings.showMorePortals}));
		await scrollDown();
	};

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
	let currentStage: Stage | null = null;
	$: camera = currentStage?.camera;
	$: player = currentStage?.player;

	$: starshipRotation = starshipAngle + Math.PI / 2;

	const SCORES_KEY = 'homeScores';
	const loadScores = (): StarshipStageScores | undefined => {
		if (!browser) return undefined;
		const saved = localStorage.getItem(SCORES_KEY);
		if (!saved) return undefined;
		try {
			return JSON.parse(saved);
		} catch (err) {
			return undefined;
		}
	};
	// TODO refactor these into a single store that handles saving/loading
	let scores: StarshipStageScores | undefined;
	let savedScores = loadScores();
	$: scoresRescuedAnyCrew = !!savedScores && rescuedAnyCrew(savedScores);
	$: scoresRescuedAllMoons = !!savedScores && rescuedAllMoons(savedScores);
	$: scoresRescuedAllCrew = !!savedScores && rescuedAllCrew(savedScores);
	$: scoresRescuedAllCrewAtOnce = !!savedScores && rescuedAllCrewAtOnce(savedScores);

	let finished = false;
	const finish = () => {
		if (finished) return;
		finished = true;
		const finalScores = mergeScores(savedScores, scores);
		if (!dequal(finalScores, savedScores)) {
			console.log(`scores changed`, finalScores);
			console.log(`previous scores`, savedScores);
			localStorage.setItem(SCORES_KEY, JSON.stringify(finalScores));
			savedScores = finalScores;
		}
	};
	const resetScores = () => {
		localStorage.removeItem(SCORES_KEY);
		savedScores = undefined;
	};

	const BOOSTER = '🙌';
	let enableBooster = true;
	$: boosterUnlocked = scoresRescuedAnyCrew;
	$: boosterEnabled = boosterUnlocked && enableBooster;
	const toggleBooster = () => {
		enableBooster = !enableBooster;
	};

	$: cameraUnlocked = scoresRescuedAllMoons;

	let starshipHeight: number;

	$: starshipScale = player ? ((player.radius * 2) / starshipHeight) * viewScale : 1; // TODO isn't reactive to player radius
	$: starshipViewX = ($camera ? (starshipX - $camera.x) * $camera.scale : starshipX) * viewScale;
	$: starshipViewY = $camera
		? (starshipY - $camera.y) * $camera.scale * viewScale - (starshipHeight - screenHeight) / 2
		: starshipY - (starshipHeight - screenHeight) / 2;

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
</script>

<svelte:window
	on:keydown={async (e) => {
		// TODO use controller instead
		if (e.key === 'Escape') {
			e.stopPropagation();
			e.preventDefault();
			if (e.ctrlKey) {
				await goto('/starship');
			} else {
				if (!starshipMode) {
					await enterStarshipMode();
				} else {
					await exitStarshipMode();
				}
			}
		} else if (e.key === 'F2') {
			e.stopPropagation();
			e.preventDefault();
			if (starshipMode) {
				clock.pause();
				finish();
			} else {
				await scrollDown();
			}
		} else if (e.key === 'F10') {
			e.stopPropagation();
			e.preventDefault();
			resetScores();
		} else if (e.key === 'F4') {
			e.stopPropagation();
			e.preventDefault();
			await toggleShowMorePortals();
		} else if (e.key === '1' && e.ctrlKey) {
			e.stopPropagation();
			e.preventDefault();
			await playSong(toSongData('Spacey Intro'));
		} else if (e.key === '2' && e.ctrlKey) {
			e.stopPropagation();
			e.preventDefault();
			await playSong(toSongData('Spacey Outro'));
		} else if (e.key === '3' && e.ctrlKey) {
			e.stopPropagation();
			e.preventDefault();
			await playSong(toSongData('Futuristic 4'));
		} else if (e.key === '4' && e.ctrlKey) {
			e.stopPropagation();
			e.preventDefault();
			await playSong(toSongData('Futuristic 1'));
		} else if (e.key === '0' && e.ctrlKey) {
			e.stopPropagation();
			e.preventDefault();
			await playSong(toSongData('Space Ambience'));
		}
	}}
/>

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
			<PortalPreview
				onClick={scoresRescuedAllCrew
					? undefined
					: async () => {
							if (!starshipMode) {
								await enterStarshipMode();
							}
					  }}
				href={scoresRescuedAllCrew ? '/starship' : undefined}
				><div
					style:font-size={scoresRescuedAllCrewAtOnce
						? 'var(--font_size_xl)'
						: 'var(--font_size_lg)'}
				>
					{#each savedScores.crew as crew, index}{#if crew}{MOON_ICONS[index]}{:else}❔{/if}{/each}
				</div></PortalPreview
			>
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
		{#if scoresRescuedAllCrew}
			<PortalPreview classes="show-more-button" onClick={toggleShowMorePortals}>
				<PendingAnimation
					running={$settings.showMorePortals && $clock.running}
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
		{#if $settings.showMorePortals}
			{#each secondaryPortals as portals}
				<ul class="portals">
					{#each portals as portal}
						<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
							<svelte:component this={portal.Preview} />
						</PortalPreview>
					{/each}
				</ul>
			{/each}
		{/if}
		{#if boosterUnlocked}
			<ul class="portals">
				<PortalPreview onClick={() => toggleBooster()}
					><span class="booster" class:disabled={!boosterEnabled}>{BOOSTER}</span></PortalPreview
				>
			</ul>
		{/if}
	</nav>
	{#if starshipMode}
		<StarshipStage
			{screenWidth}
			{screenHeight}
			{viewWidth}
			{viewHeight}
			{worldWidth}
			{worldHeight}
			{boosterEnabled}
			{cameraUnlocked}
			bind:starshipX
			bind:starshipY
			bind:starshipAngle
			bind:starshipShieldRadius
			bind:scores
			bind:currentStage
			exit={exitStarshipMode}
			{finish}
		/>
		{#if finished}
			<div class="exit">
				<FloatingIconButton
					label="return home"
					on:click={() => exitStarshipMode()}
					style="font-size: var(--font_size_xl3)"
				>
					{#if scoresRescuedAnyCrew}{BOOSTER}{:else}↩{/if}
				</FloatingIconButton>
				<StarshipStageScore {scores} />
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
		will-change: transform; /* might prevent some jank but may use unnecessary resources */
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
