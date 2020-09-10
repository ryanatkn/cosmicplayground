<script>
	import {writable} from 'svelte/store';
	import * as PIXI from 'pixi.js';

	import PixiView from './PixiView.svelte';
	import Hud from './Hud.svelte';
	import HomeButton from './HomeButton.svelte';
	import {provideRouter} from './routerStore.js';
	import {provideAudioCtx} from '../audio/audioCtx.js';
	import {provideClock} from './clockStore.js';
	import {provideSettings} from './settingsStore.js';
	import {providePortals, findPortalBySlug} from './portalsStore.js';
	import {trackIdleState} from './trackIdleState.js';
	import {updateRenderStats} from './renderStats.js';
	import {portalsData} from '../portals/index.js';
	import {PixiApp, providePixi} from './pixi.js';
	import {createPixiBgStore} from './pixiBgStore.js';

	let width = window.innerWidth;
	let height = window.innerHeight;

	const settings = provideSettings({
		audioEnabled: true,
		devMode: false,
		recordingMode: false,
		timeToGoIdle: 6000,
	});

	const clock = provideClock(); // TODO integrate with Pixi ticker?
	$: updateRenderStats($clock.dt);

	const pixi = new PixiApp({width, height});
	providePixi(pixi);
	window['pixi'] = pixi; // TODO dont do this, or at least handle SSR

	const bg = createPixiBgStore(
		pixi.loader,
		pixi.defaultScene,
		'/assets/space/galaxies.jpg',
		width,
		height,
	);
	bg.loadResources();
	$: bg.updateDimensions(width, height);
	$: bg.tick($clock.dt);

	const router = provideRouter();

	const portals = providePortals(portalsData);
	$: activePortal = findPortalBySlug($portals, $router.slug);

	const idle = writable(false);
	$: timeToGoIdle = $settings.devMode ? 99999999999 : $settings.timeToGoIdle;

	provideAudioCtx(); // allows components to do `const audioCtx = useAudioCtx();` which uses svelte's `getContext`

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
	use:trackIdleState={{idle, timeToGoIdle, idleIntervalTime: 1000}}
	on:keydown={onKeyDown}
/>

<div class="pixi-wrapper" style="width: {width}px; height: {height}px;">
	<PixiView {pixi} {width} {height} />
</div>

<main class:paused={!$clock.running} class:idle={$idle}>
	{#if activePortal.showHomeButton}
		<Hud>
			<HomeButton />
		</Hud>
	{/if}
	<svelte:component this={activePortal.View} portal={activePortal} {width} {height} />
</main>

<!-- TODO should we have a `<Portals/>` component that the `App` mounts? -->

<style>
	.pixi-wrapper {
		position: fixed;
		z-index: 0;
		left: 0;
		top: 0;
	}
	main {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
	}
	.paused {
		filter: grayscale();
	}
</style>
