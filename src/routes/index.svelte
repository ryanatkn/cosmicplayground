<script lang="ts">
	import {tick} from 'svelte';
	import {wait} from '@feltcoop/felt';

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
	import {areScoresPerfect, Stage, type StarshipStageScores} from '$lib/portals/home/starshipStage';
	import {getDimensions} from '$lib/app/dimensions';

	// TODO show scores - # friends, planet, top scores for each dimension (most of each, so 1-2 records per dimension set)
	// visualize the data
	// collect and publish the data! how?

	const dimensions = getDimensions();
	$: ({width, height} = $dimensions);
	const clock = getClock();

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
	$: perfectSavedScores = !!savedScores && areScoresPerfect(savedScores);
	$: perfectScores = !!scores && areScoresPerfect(scores);

	let finished = false;
	const finish = () => {
		if (finished) return;
		finished = true;
		// TODO only save if score is better
		if (!perfectSavedScores) {
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
	$: boosterUnlocked = perfectSavedScores;
	$: boosterEnabled = boosterUnlocked && enableBooster;
	const toggleBooster = () => {
		enableBooster = !enableBooster;
	};

	const STARSHIP_RADIUS = 100; // TODO implement from starship radius (on stage?)
	$: starshipScale = (STARSHIP_RADIUS * 2) / starshipHeight;
	$: starshipViewX = $camera ? (starshipX - $camera.x) * $camera.scale : starshipX;
	$: starshipViewY = $camera
		? (starshipY - $camera.y) * $camera.scale - (starshipHeight - height) / 2
		: starshipY - (starshipHeight - height) / 2;
	let pausedClock = false;
	const enterStarshipMode = async () => {
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
		console.log('exitStarshipMode');
		starshipAngle = 0;
		starshipMode = false;
		if (pausedClock) clock.resume();
		transitioningStarshipModeCount++;
		await wait(TRANSITION_DURATION);
		transitioningStarshipModeCount--;
	};

	let starshipWidth: number;
	let starshipHeight: number;
	$: console.log(`starshipWidth`, starshipWidth);
	$: console.log(`starshipHeight`, starshipHeight);
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
		} else if (e.key === 'F6') {
			resetScores();
		} else if (e.key === 'F4') {
			await toggleShowMorePortals();
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
		bind:clientWidth={starshipWidth}
		bind:clientHeight={starshipHeight}
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
			<h2>
				show {#if $settings.showMorePortals}less{:else}more{/if}
			</h2>
			<div>
				<img
					src="/assets/earth/night_lights_1.png"
					alt="night lights of Africa, Europe, and the Middle East"
					style="width: 100px; height: 100px;"
					class="mr-2"
				/>
				<img
					src="/assets/earth/night_lights_2.png"
					alt="night lights of the Americas"
					style="width: 100px; height: 100px;"
					class="mr-2"
				/>
				<img
					src="/assets/earth/night_lights_3.png"
					alt="night lights of Asia and Australia"
					style="width: 100px; height: 100px;"
				/>
			</div>
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
		<StarshipStageScore {scores} />
		<StarshipStage
			{width}
			{height}
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
					{#if perfectScores}{BOOSTER}{:else}↩{/if}
				</FloatingIconButton>
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
	}
	.starship-ready nav {
		cursor: pointer;
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
	.exit {
		position: fixed;
		left: 0;
		top: 0;
		transform: translate3d(calc(100vw / 2 - 50%), calc(100vh / 2 - 50%), 0);
		user-select: none;
		/* TODO hacky -- maybe `.opaque` or remove transparency from the FloatingIconButton or make it a prop?  */
		--hud_element_size: 200px;
		--clickable_opacity: 1;
		--clickable_opacity__hover: 1;
		--clickable_opacity__active: 1;
	}
</style>
