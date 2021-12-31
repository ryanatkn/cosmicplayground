<script lang="ts">
	import {tick} from 'svelte';

	import PortalPreview from './PortalPreview.svelte';
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
	import {wait} from '@feltcoop/felt';
	import {getClock} from '$lib/app/clockStore';

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
		await tick();
		window.scrollTo({left: window.scrollX, top: 9000, behavior: 'smooth'}); // `9000` bc `Infinity` doesn't work and I don't care to calculate it
	};

	// TODO refactor all of this, lots of modules and components to extract
	// TODO add earth and space trash gameplay
	// TODO exit offscreen to a whole new world
	let turningLeft = false;
	let turningRight = false;
	let movingForward = false;
	let movingBackward = false;
	let starshipX = 0;
	let starshipY = 0;
	let starshipRotate = 0;
	let starshipMode = false;
	const TRANSITION_DURATION = 500;
	let transitioningStarshipModeCount = 0; // counter so it handles concurrent calls without much code
	$: transitioningStarshipMode = !!transitioningStarshipModeCount;
	$: starshipReady = starshipMode && !transitioningStarshipMode;
	const ROTATE_INCREMENT = Math.PI * 0.0013;
	const MOVEMENT_INCREMENET = 0.3; // TODO velocity?
	const exitStarshipMode = async () => {
		starshipMode = false;
		transitioningStarshipModeCount++;
		await wait(TRANSITION_DURATION);
		transitioningStarshipModeCount--;
	};
	const enterStarshipMode = async () => {
		starshipMode = true;
		starshipRotate = -ROTATE_INCREMENT;
		starshipX = 0;
		starshipY = 0;
		transitioningStarshipModeCount++;
		await wait(TRANSITION_DURATION);
		transitioningStarshipModeCount--;
	};
	$: starshipReady && updateMovement($clock.dt);
	const updateMovement = (dt: number) => {
		const turning = (turningLeft ? -1 : 0) + (turningRight ? 1 : 0);
		if (turning) {
			starshipRotate += turning * ROTATE_INCREMENT * dt; // TODO probably modulo `Math.PI * 2` but it's funny how much it spins
		}
		const moving = (movingForward ? 1 : 0) + (movingBackward ? -1 : 0);
		if (moving) {
			starshipX += moving * Math.sin(starshipRotate) * MOVEMENT_INCREMENET * dt;
			starshipY += -moving * Math.cos(starshipRotate) * MOVEMENT_INCREMENET * dt;
		}
	};
	const onKeydown = (e: KeyboardEvent) => {
		if (!starshipMode) throw Error('TODO probably remove this check');
		switch (e.key) {
			case 'ArrowLeft':
			case 'a': {
				turningLeft = true;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				turningRight = true;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				movingForward = true;
				break;
			}
			case 'ArrowDown':
			case 's': {
				movingBackward = true;
				break;
			}
			case 'Escape': {
				exitStarshipMode();
				break;
			}
		}
	};
	const onKeyup = (e: KeyboardEvent) => {
		if (!starshipMode) throw Error('TODO probably remove this check');
		switch (e.key) {
			case 'ArrowLeft':
			case 'a': {
				turningLeft = false;
				break;
			}
			case 'ArrowRight':
			case 'd': {
				turningRight = false;
				break;
			}
			case 'ArrowUp':
			case 'w': {
				movingForward = false;
				break;
			}
			case 'ArrowDown':
			case 's': {
				movingBackward = false;
				break;
			}
		}
	};
</script>

<svelte:window
	on:keydown={starshipMode ? onKeydown : undefined}
	on:keyup={starshipMode ? onKeyup : undefined}
/>

<nav
	class="portal-previews"
	class:starship-mode={starshipMode}
	class:starship-ready={starshipReady}
	style={(starshipMode
		? `transform: translate3d(${starshipX}px, ${starshipY}px, 0) scale3d(0.1, 0.1, 0.1) rotate(${starshipRotate}rad);`
		: '') +
		(starshipReady
			? 'transition: none;'
			: `transition: transform ${TRANSITION_DURATION}ms ease-in-out;`)}
	on:click|capture={(e) => {
		// TODO ideally this would be the following,
		// but Svelte can't handle modifiers with undefined handlers right now:
		// on:click|capture|preventDefault|stopPropagation={starshipReady
		// ? () => exitStarshipMode()
		// : undefined}
		if (starshipMode) {
			e.preventDefault();
			e.stopPropagation();
			exitStarshipMode();
		}
	}}
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
					<PortalPreview onClick={enterStarshipMode}><div class="starship">🛸</div></PortalPreview>
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
</nav>

<style>
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
	.portal-previews {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		width: 100%; /* allows nesting without shared rows to let the toggle stay still */
	}
	.starship {
		font-size: 84px;
	}
	.starship-ready {
		cursor: pointer;
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
</style>
