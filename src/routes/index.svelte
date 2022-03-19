<script lang="ts">
	import {tick} from 'svelte';
	import {wait} from '@feltcoop/felt';
	import PendingAnimation from '@feltcoop/felt/ui/PendingAnimation.svelte';

	import PortalPreview from '$lib/portals/home/PortalPreview.svelte';
	import aboutPortal from '$lib/portals/about/data';
	import deepBreathPortal from '$lib/portals/deep-breath/data';
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
		rescuedAllFriends,
		rescuedAnyCrew,
		Stage,
		type StarshipStageScores,
	} from '$lib/portals/home/starshipStage';
	import {getDimensions} from '$lib/app/dimensions';
	import {
		createResourcesStore,
		type AudioResource,
		type ResourcesStore,
	} from '$lib/app/resourcesStore';
	import {resizer} from '$lib/ui/resizeObserver';

	const dimensions = getDimensions();
	const clock = getClock();

	$: ({width: screenWidth, height: screenHeight} = $dimensions);

	$: viewUnlocked = savedScoresRescuedAllFriends;
	const DEFAULT_WORLD_DIMENSIONS = {width: 2560, height: 1440};

	// TODO should we pass through plain numbers or a dimensions object?
	// // TODO what about the camera zoom relative to what can fit in the dimensions?
	let viewWidth: number;
	let viewHeight: number;
	let worldWidth: number;
	let worldHeight: number;
	$: viewScale = viewWidth / worldWidth; // this is the same for X and Y as currently calculated, aspect ratio is preserved
	$: if (viewUnlocked) {
		// TODO BLOCK expand view dimensions to fit screen when unlocked
		// Expand the world dimensions to fit the screen dimensions.
		// const aspectRatio = screenDimensions.width / screenDimensions.height; // TODO cache on dimensions?
		viewWidth = screenWidth;
		viewHeight = screenHeight;
		worldWidth = DEFAULT_WORLD_DIMENSIONS.width;
		worldHeight = DEFAULT_WORLD_DIMENSIONS.height;
	} else {
		// TODO BLOCK refactor with above and other things, should be able to get clear abstractions
		worldWidth = DEFAULT_WORLD_DIMENSIONS.width;
		worldHeight = DEFAULT_WORLD_DIMENSIONS.height;
		const worldAspectRatio = worldWidth / worldHeight;
		const viewAspectRatio = screenWidth / screenHeight;
		viewWidth =
			worldAspectRatio < viewAspectRatio
				? (screenWidth * (worldAspectRatio / viewAspectRatio)) | 0
				: screenWidth;
		viewHeight =
			worldAspectRatio > viewAspectRatio
				? (screenHeight * (viewAspectRatio / worldAspectRatio)) | 0
				: screenHeight;
	}

	const starshipPortal = Symbol(); // expected be the only symbol in `primaryPortals`

	const primaryPortals = [
		[deepBreathPortal],
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
	let scores: StarshipStageScores | undefined;
	let savedScores = loadScores();
	$: savedScoresRescuedAnyCrew = !!savedScores && rescuedAnyCrew(savedScores);
	$: scoresRescuedAnyCrew = !!scores && rescuedAnyCrew(scores);
	$: savedScoresRescuedAllFriends = !!savedScores && rescuedAllFriends(savedScores);
	// TODO use these
	// $: scoresRescuedAllFriends = !!scores && rescuedAllFriends(scores);
	// $: savedScoresRescuedAllCrew = !!savedScores && rescuedAllCrew(savedScores);
	// $: scoresRescuedAllCrew = !!scores && rescuedAllCrew(scores);

	let finished = false;
	const finish = () => {
		if (finished) return;
		finished = true;
		// TODO only save if score is better
		if (!savedScoresRescuedAnyCrew) {
			localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
			savedScores = scores;
		}
	};
	const resetScores = () => {
		localStorage.removeItem(SCORES_KEY);
		savedScores = undefined;
	};

	const BOOSTER = '🙌';
	let enableBooster = true;
	$: boosterUnlocked = savedScoresRescuedAnyCrew;
	$: boosterEnabled = boosterUnlocked && enableBooster;
	const toggleBooster = () => {
		enableBooster = !enableBooster;
	};

	let starshipHeight: number;

	const STARSHIP_RADIUS = 100; // TODO implement from starship radius (on stage?)
	$: starshipScale = ((STARSHIP_RADIUS * 2) / starshipHeight) * viewScale;
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

	const pauseAudio = () => {
		if (introSong?.audio && !introSong.audio.paused) introSong.audio.pause();
		if (outroSong?.audio && !outroSong.audio.paused) outroSong.audio.pause();
	};
	const playAudio = (audio: HTMLAudioElement, currentTime = 0): Promise<void> => {
		audio.currentTime = currentTime;
		return audio.play();
	};

	let audioKey: symbol | undefined;

	// TODO this API is not fun, resources should probably be stores
	const playSong = async (
		url: string,
		resources: ResourcesStore,
		getPromise: () => Promise<void> | null, // TODO HACK
		getSongResource: () => AudioResource | undefined,
		setSongResource: (song: AudioResource | undefined) => void,
	) => {
		pauseAudio();
		if (!getSongResource()) {
			const song = resources.addResource('audio', url);
			resources.load(); // eslint-disable-line @typescript-eslint/no-floating-promises
			setSongResource(song); // TODO improve API, maybe return a typed store from `addResource`
		}
		const key = (audioKey = Symbol());
		await Promise.all([getPromise(), exitStarshipMode()]);
		if (audioKey !== key) return;
		await enterStarshipMode();
		if (audioKey !== key) return;
		const song = getSongResource();
		setSongResource(song); // TODO improve API, maybe return a typed store from `addResource`
		if (!song || song.status !== 'success' || !song.audio) {
			throw Error('Failed to load song'); // TODO handle failures better (Dialog error?)
		}
		song.audio.volume = 0.5; // TODO where?
		return playAudio(song.audio);
	};

	const introResources = createResourcesStore();
	let introSong: AudioResource | undefined;
	const INTRO_SONG_URL = '/assets/audio/Alexander_Nakarada__Spacey_Intro.mp3';
	const startIntro = (): Promise<void> =>
		playSong(
			INTRO_SONG_URL,
			introResources,
			() => $introResources.promise, // TODO HACK
			() => $introResources.resources.find((r) => r.url === INTRO_SONG_URL) as any, // TODO improve API, maybe return a typed store from `addResource`
			(song) => (introSong = song),
		);

	const outroResources = createResourcesStore();
	let outroSong: AudioResource | undefined;
	const OUTRO_SONG_URL = '/assets/audio/Alexander_Nakarada__Spacey_Outro.mp3';
	const startOutro = (): Promise<void> =>
		playSong(
			OUTRO_SONG_URL,
			outroResources,
			() => $outroResources.promise, // TODO HACK
			() => $outroResources.resources.find((r) => r.url === OUTRO_SONG_URL) as any, // TODO improve API, maybe return a typed store from `addResource`
			(song) => (outroSong = song),
		);
</script>

<svelte:window
	on:keydown={async (e) => {
		// TODO use controller instead
		if (e.key === 'Escape') {
			e.stopPropagation();
			if (!starshipMode) {
				await enterStarshipMode();
			} else {
				await exitStarshipMode();
			}
		} else if (e.key === 'F2') {
			finish();
			if (!starshipMode) {
				await scrollDown();
			}
		} else if (e.key === 'F10') {
			if (savedScores) {
				resetScores();
			} else {
				finish();
			}
		} else if (e.key === 'F4') {
			await toggleShowMorePortals();
		} else if (e.key === '1' && e.ctrlKey) {
			e.stopPropagation();
			e.preventDefault();
			await startIntro();
		} else if (e.key === '2' && e.ctrlKey) {
			e.stopPropagation();
			e.preventDefault();
			await startOutro();
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
		use:resizer={(entries) => {
			starshipHeight = entries[0].contentRect.height;
		}}
		style:transform={starshipMode
			? `translate3d(${starshipViewX}px, ${starshipViewY}px,	0) scale3d(${starshipScale}, ${starshipScale}, ${starshipScale})	rotate(${starshipRotation}rad)`
			: 'none'}
		style:transition={starshipReady ? 'none' : `transform ${TRANSITION_DURATION}ms ease-in-out`}
	>
		<header class="portals">
			<PortalPreview href={aboutPortal.slug} classes="portal-preview--{aboutPortal.slug}">
				<svelte:component this={aboutPortal.Preview} portal={aboutPortal} />
			</PortalPreview>
		</header>
		{#each primaryPortals as portals}
			<ul class="portals">
				{#each portals as portal (portal)}
					{#if typeof portal === 'symbol'}
						<PortalPreview onClick={enterStarshipMode} classes="portal-preview--starship"
							><div class="starship">🛸</div></PortalPreview
						>
					{:else}
						<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
							<svelte:component this={portal.Preview} {portal} />
						</PortalPreview>
					{/if}
				{/each}
			</ul>
		{/each}
		<PortalPreview classes="show-more-button" onClick={toggleShowMorePortals}>
			<PendingAnimation running={$settings.showMorePortals} let:index>
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
		{#if $settings.showMorePortals}
			{#each secondaryPortals as portals}
				<ul class="portals">
					{#each portals as portal}
						<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
							<svelte:component this={portal.Preview} {portal} />
						</PortalPreview>
					{/each}
				</ul>
			{/each}
		{/if}
		{#if boosterUnlocked}
			<ul class="portals">
				<PortalPreview onClick={() => toggleBooster()}
					><span style:font-size="144px" class:disabled={!boosterEnabled}>{BOOSTER}</span
					></PortalPreview
				>
			</ul>
		{/if}
	</nav>
	{#if starshipMode}
		<!-- TODO does this belong in the stage component? -->
		<div class="scores">
			<StarshipStageScore {scores} />
		</div>
		<StarshipStage
			{screenWidth}
			{screenHeight}
			{viewWidth}
			{viewHeight}
			{worldWidth}
			{worldHeight}
			{boosterEnabled}
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
				<StarshipStageScore {scores} layout="text" />
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
	:global(.portal-preview--deep-breath) {
		border-color: var(--ocean_color) !important;
	}
	:global(.portal-preview--starlit-hammock) {
		border-color: var(--space_color) !important;
	}
	:global(.portal-preview--starship) {
		border-color: var(--photon_color) !important;
	}

	.scores {
		user-select: none;
		position: absolute;
		left: 0;
		top: 0;
		text-align: center;
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
