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
	import RadialLayout from '$lib/ui/RadialLayout.svelte';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import {browser} from '$app/env';
	import {getClock} from '$lib/app/clockStore';
	import {Stage, type StarshipStageScores} from '$lib/portals/home/starshipStage';
	import {getDimensions} from '$lib/app/dimensions';

	// TODO show scores - # friends, planet, top scores for each dimension (most of each, so 1-2 records per dimension set)
	// visualize the data
	// collect and publish the data! how?

	const dimensions = getDimensions();
	$: ({width, height} = $dimensions);

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
	let savedScoresRaw: string | null = localStorage.getItem(SCORES_KEY);
	let savedScores: StarshipStageScores | undefined;
	$: savedScores = parseScores(savedScoresRaw);
	const parseScores = (raw: string | null): StarshipStageScores | undefined => {
		if (!raw) return undefined;
		try {
			return JSON.parse(raw);
		} catch (err) {
			return undefined;
		}
	};
	let done = false;
	let scores = browser ? savedScores : undefined;
	const greatSuccess = (saved = true) => {
		if (!currentStage) throw Error('Expected a stage to make success');
		done = true;
		const serialized = JSON.stringify(scores);
		if (saved) {
			localStorage.setItem(SCORES_KEY, serialized); // TODO set time
			savedScoresRaw = serialized;
		}
	};
	const resetScores = (saved = false) => {
		scores = undefined;
		if (browser) {
			if (saved) {
				savedScoresRaw = null;
				localStorage.removeItem(SCORES_KEY);
			}
		}
	};

	let enableBooster = true;
	$: boosterEnabled = !!savedScores && enableBooster;
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
		done = false;
		dtMs = 0;
		starshipAngle = 0;
		starshipMode = true;
		scores = undefined;
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
		scores = savedScores;
		if (pausedClock) clock.resume();
		transitioningStarshipModeCount++;
		await wait(TRANSITION_DURATION);
		transitioningStarshipModeCount--;
	};

	let starshipWidth: number;
	let starshipHeight: number;
	$: console.log(`starshipWidth`, starshipWidth);
	$: console.log(`starshipHeight`, starshipHeight);

	const clock = getClock();
	const STARSHIP_HEAT_DEATH = 60 * 1000 * 6;
	$: heatdeath = $clock.time > STARSHIP_HEAT_DEATH;
	$: starshipMode && heatdeath && exitStarshipMode().then(() => enterStarshipMode());

	let dtMs = 0;
	$: if (starshipMode) dtMs += $clock.dt;
	$: dtSeconds = Math.round(dtMs / 1000);
	const WIN_SECONDS = 30;
	$: dtSeconds > WIN_SECONDS && greatSuccess(); // TODO refactor

	export const faces = ['🐭', '🐶', '🐰', '🦊', '🐱'];
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
			if (savedScores) {
				resetScores(true);
			} else {
				greatSuccess();
				if (!starshipMode) {
					await scrollDown();
				}
			}
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
		{#if savedScores}
			<ul class="portals">
				<PortalPreview onClick={() => toggleBooster()}
					><span style:font-size="144px" class:disabled={!boosterEnabled}>🙌</span></PortalPreview
				>
			</ul>
		{/if}
	</nav>
	{#if starshipMode}
		<div class="score-wrapper">
			<RadialLayout items={faces.slice(1)} totalCount={16} width={100} let:item let:index>
				<div class="score-friend-item" style:transform="translate3d({item.x}px, {item.y}px, 0)">
					{item.value}
					{#if scores && !scores.friends[index]}
						<div class="skull">💀</div>
					{/if}
				</div>
			</RadialLayout>
			<div class="score-planet-item">
				{faces[0]}
				{#if scores && !scores.planet}
					<div class="skull">💀</div>
				{/if}
			</div>
		</div>
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
			{exitStarshipMode}
		/>
		{#if done}
			<div class="exit">
				<FloatingIconButton
					label="return home"
					on:click={() => exitStarshipMode()}
					style="font-size: var(--font_size_xl5)"
				>
					↩
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
	.score-wrapper {
		user-select: none;
		position: absolute;
		left: 0;
		bottom: 0;
	}
	.score-friend-item {
		font-size: var(--font_size_xl);
		position: relative;
	}
	.score-planet-item {
		font-size: var(--font_size_xl3);
		position: relative;
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
	.skull {
		position: absolute;
		inset: 0;
		font-size: 90%;
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
		position: absolute;
		inset: 0;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		user-select: none;
	}
</style>
