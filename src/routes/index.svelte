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
	import {browser} from '$app/env';
	import {getClock} from '$lib/app/clockStore';
	import {Stage} from '$lib/portals/home/starshipStage';

	// TODO show scores - # friends, planet, top scores for each dimension (most of each, so 1-2 records per dimension set)
	// visualize the data
	// collect and publish the data! how?

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

	const DISASTER_AVERTED_KEY = 'homeDisasterAverted';
	let savedDisasterAverted = !!localStorage.getItem(DISASTER_AVERTED_KEY);
	let disasterAverted = browser && savedDisasterAverted;
	$: disasterAverted && greatSuccess();
	const greatSuccess = (saved = true) => {
		const data = '1';
		disasterAverted = true;
		if (saved) {
			localStorage.setItem(DISASTER_AVERTED_KEY, data); // TODO set time
			savedDisasterAverted = true;
		}
	};
	const resetDisasterAverted = (saved = false) => {
		disasterAverted = false;
		if (browser) {
			if (saved) {
				savedDisasterAverted = false;
				localStorage.removeItem(DISASTER_AVERTED_KEY);
			}
		}
	};

	const toggleDisasterAverted = () =>
		disasterAverted ? resetDisasterAverted() : greatSuccess(false);

	// const STARSHIP_SIZE = 100; // TODO implement from starship radius (on stage?)
	const STARSHIP_SCALE = 0.1;
	$: starshipViewX = $camera ? (starshipX - $camera.x) * $camera.scale : starshipX; // + starshipShieldRadius / 2 - (starshipWidth * STARSHIP_SCALE) / 2
	$: starshipViewY = $camera ? (starshipY - $camera.y) * $camera.scale : starshipY; // + (height * STARSHIP_SCALE) / 2; //  - starshipShieldRadius / 2
	const enterStarshipMode = async () => {
		console.log('enterStarshipMode');
		dtMs = 0;
		starshipAngle = 0;
		starshipMode = true;
		disasterAverted = false;
		clock.set({...$clock, time: 0, dt: 0}); // TODO `reset`?
		transitioningStarshipModeCount++;
		await wait(TRANSITION_DURATION);
		transitioningStarshipModeCount--;
	};
	const exitStarshipMode = async () => {
		console.log('exitStarshipMode');
		starshipAngle = 0;
		starshipMode = false;
		disasterAverted = savedDisasterAverted;
		transitioningStarshipModeCount++;
		await wait(TRANSITION_DURATION);
		transitioningStarshipModeCount--;
	};

	let width: number;
	let height: number;
	let starshipWidth: number;
	let starshipHeight: number;
	$: console.log(`starshipWidth`, starshipWidth);
	$: console.log(`starshipHeight`, starshipHeight);

	const clock = getClock();
	const STARSHIP_HEAT_DEATH = 60 * 1000 * 6;
	$: heatdeath = $clock.time > STARSHIP_HEAT_DEATH;
	$: starshipMode && heatdeath && exitStarshipMode().then(() => enterStarshipMode());

	let dtMs = 0;
	$: dtSeconds = Math.round(dtMs / 1000);
	$: dtMs += $clock.dt;
	$: console.log(`dtSeconds`, dtSeconds);
	// TODO this 30 seconds works well, but do we want to abstract this logic for reusability? compose as a function?
	const WIN_SECONDS = 30;
	$: dtSeconds > WIN_SECONDS && greatSuccess(); // TODO  show # friends, planet or not, etc, save scores (composed out here, so decoupled)
</script>

<svelte:window
	on:keydown={async (e) => {
		if (e.key === 'Escape') {
			if (!starshipMode) {
				await enterStarshipMode();
				e.stopPropagation();
				e.preventDefault();
			} else {
				await exitStarshipMode();
				e.stopPropagation();
				e.preventDefault();
			}
		} else if (e.key === 'F2') {
			if (savedDisasterAverted) {
				resetDisasterAverted(true);
			} else {
				greatSuccess();
				if (!starshipMode) {
					await scrollDown();
				}
			}
		}
	}}
/>

<div
	class="home"
	class:starship-mode={starshipMode}
	class:starship-ready={starshipReady}
	class:starship-transitioning={transitioningStarshipMode}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<nav
		bind:clientWidth={starshipWidth}
		bind:clientHeight={starshipHeight}
		style:transform={starshipMode
			? `translate3d(${starshipViewX}px, ${starshipViewY}px,	0) scale3d(${STARSHIP_SCALE}, ${STARSHIP_SCALE}, ${STARSHIP_SCALE})	rotate(${starshipRotation}rad)`
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
		{#if disasterAverted || savedDisasterAverted}
			<ul class="portals">
				<PortalPreview onClick={() => toggleDisasterAverted()}
					><span style:font-size="144px" class:disabled={savedDisasterAverted && !disasterAverted}
						>🙌</span
					></PortalPreview
				>
			</ul>
		{/if}
	</nav>
	{#if starshipMode}
		<StarshipStage
			{width}
			{height}
			bind:starshipX
			bind:starshipY
			bind:starshipAngle
			bind:starshipShieldRadius
			bind:disasterAverted
			bind:currentStage
			{exitStarshipMode}
		/>
		{#if disasterAverted}
			<div class="exit">
				<button
					type="button"
					style:font-size="256px"
					style:border-radius="50%"
					on:click={() => exitStarshipMode()}
				>
					🙌
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.home {
		overflow: hidden;
	}
	.home.starship-mode,
	.home.starship-transitioning {
		position: fixed !important;
		inset: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
		position: absolute;
		inset: 0;
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
