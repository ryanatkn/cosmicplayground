<script>
	import {writable} from 'svelte/store';

	import GalaxyBg from './GalaxyBg.svelte';
	import BackButton from './BackButton.svelte';
	import {initAudioCtx} from '../audio/audioCtx.js';
	import {initClock} from './clock.js';
	import {initSettings} from './settingsStore.js';
	import {initPortals, findPortalBySlug} from './portalsStore.js';
	import {trackIdleState} from './trackIdleState.js';
	import {updateRenderStats} from './renderStats.js';
	import {portalsData} from '../portals/index.js';

	let width = window.innerWidth;
	let height = window.innerHeight;

	const clock = initClock();

	const settings = initSettings({
		audioEnabled: true,
		devMode: false,
		recordingMode: false,
		timeToGoIdle: 6000,
	});

	let hash = typeof window === 'undefined' ? '' : window.location.hash;
	const DEFAULT_PORTAL_SLUG = 'home';
	$: activePortalSlug = hash.slice(1) || DEFAULT_PORTAL_SLUG;
	const onHashChange = (e) => {
		hash = window.location.hash;
	};

	const portals = initPortals(portalsData);
	$: activePortal = findPortalBySlug($portals, activePortalSlug);

	const idle = writable(false);
	$: timeToGoIdle = $settings.devMode ? 99999999999 : $settings.timeToGoIdle;

	initAudioCtx(); // allows components to do `const audioCtx = useAudioCtx();` which uses svelte's `getContext`

	const onKeyDown = (e) => {
		// TODO main menu!
		if ($settings.devMode && e.key === '`') {
			if (!e.target.closest('input')) clock.toggle();
		}
	};
</script>

<svelte:window
	bind:innerWidth={width}
	bind:innerHeight={height}
	on:hashchange={onHashChange}
	use:trackIdleState={{idle, timeToGoIdle, idleIntervalTime: 1000}}
	on:keydown={onKeyDown}
/>

{#if activePortal.showBackground}
	<!-- TODO should this NOT be a "section"? -->
	<section class="bg">
		<GalaxyBg running={$clock.running} {width} {height} />
	</section>
{/if}

<main class:paused={!$clock.running} class:idle={$idle}>
	{#if activePortal.showBackButton}
		<div class="back-button-wrapper">
			<BackButton />
		</div>
	{/if}
	<svelte:component this={activePortal.View} portal={activePortal} {width} {height} />
</main>

<!-- TODO should we have a `<Portals/>` component that the `App` mounts? -->

<style>
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
	main {
		position: relative;
		z-index: 1;
		height: 100%; /* TODO need to fix with "initial" usage */
		display: flex;
		flex-direction: column;
	}
	.paused {
		filter: grayscale();
	}

	.back-button-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
	}
</style>
