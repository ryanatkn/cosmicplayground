<script>
	import {onMount} from 'svelte';
	import {writable} from 'svelte/store';
	import * as PIXI from 'pixi.js';
	import {AsyncState} from '@feltcoop/gro/dist/utils/async.js';

	import PixiView from './PixiView.svelte';
	import PortalView from './PortalView.svelte';
	import Hud from './Hud.svelte';
	import HomeButton from './HomeButton.svelte';
	import Panel from './Panel.svelte';
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
	import WaitingScreen from './WaitingScreen.svelte';

	let width = window.innerWidth;
	let height = window.innerHeight;

	const settings = provideSettings({
		audioEnabled: true, // TODO make this work everywhere? hmm. global mute/volume?
		devMode: false,
		recordingMode: false,
		idleMode: false,
		timeToGoIdle: 6000,
	});

	const clock = provideClock(); // TODO integrate with Pixi ticker?
	$: updateRenderStats($clock.dt);

	let supportsWebGL = null;
	let pixi;
	try {
		pixi = new PixiApp({width, height});
		supportsWebGL = true;
	} catch (err) {
		supportsWebGL = false; // usually probably correct to infer this
		console.error(err);
	}
	providePixi(pixi);
	window['pixi'] = pixi; // TODO improve this pattern

	const bgImageUrl = '/assets/space/galaxies.jpg';
	let bg;
	$: bg && bg.updateDimensions(width, height);
	$: bg && bg.tick($clock.dt);

	let loadingStatus = AsyncState.Initial;
	const loadInitialResources = () => {
		pixi.loader.add(bgImageUrl).load(() => {
			bg = createPixiBgStore(pixi.loader.resources[bgImageUrl].texture, width, height);
			pixi.defaultScene.addChild($bg.sprite);
			loadingStatus = AsyncState.Success;
		});
		loadingStatus = AsyncState.Pending;
	};

	const router = provideRouter();

	const portals = providePortals(portalsData);
	$: activePortal = findPortalBySlug($portals, $router.slug);

	const idle = writable(false);
	$: timeToGoIdle = $settings.devMode
		? 99999999999
		: $settings.recordingMode
		? 500
		: $settings.timeToGoIdle;

	provideAudioCtx(); // allows components to do `const audioCtx = useAudioCtx();` which uses svelte's `getContext`

	const enableGlobalHotkeys = (e) => !e.target.closest('input');
	const onKeyDown = (e) => {
		// TODO main menu!

		// toggle dev mode
		if (e.key === '`' && e.ctrlKey) {
			settings.update((s) => ({...s, devMode: !s.devMode}));
			console.log('dev mode is now', $settings.devMode);
		}
		// dev mode hotkeys
		if ($settings.devMode) {
			if (e.key === '`' && !e.ctrlKey && enableGlobalHotkeys(e)) {
				clock.toggle();
				console.log('clock is now', $clock.running ? 'running' : 'paused');
			} else if (e.key === '-' && !e.ctrlKey && enableGlobalHotkeys(e)) {
				settings.update((s) => ({...s, idleMode: !s.idleMode}));
				console.log('idle mode is now', $settings.idleMode);
			} else if (e.key === '=' && !e.ctrlKey && enableGlobalHotkeys(e)) {
				settings.update((s) => ({...s, recordingMode: !s.recordingMode}));
				console.log('recording mode is now', $settings.recordingMode);
			}
		}
	};

	onMount(() => {
		loadInitialResources();
	});
</script>

<svelte:window
	bind:innerWidth={width}
	bind:innerHeight={height}
	use:trackIdleState={{idle, timeToGoIdle, idleIntervalTime: 1000}}
	on:keydown={onKeyDown}
/>

{#if supportsWebGL}
	{#if loadingStatus !== AsyncState.Success}
		<WaitingScreen status={loadingStatus} />
	{:else}
		<div class="pixi-wrapper fade-in" style="width: {width}px; height: {height}px;">
			<PixiView {pixi} {width} {height} />
		</div>
		<main class="fade-in" class:paused={!$clock.running} class:idle={$idle || $settings.idleMode}>
			{#if activePortal.showHomeButton}
				<Hud>
					<HomeButton />
				</Hud>
			{/if}
			<PortalView portal={activePortal} {width} {height} />
		</main>
	{/if}
{:else if supportsWebGL === null}
	<!-- render nothing yet -->
{:else}
	<Panel>
		<h1>oh no :(</h1>
		<p>
			It looks like your browser doesn't support WebGL, and sadly this website requires it. I'm
			sorry, please try another browser or device if you can. (or enable it?)
		</p>
		<p>
			source code is at <a href="https://github.com/ryanatkn/cosmicplayground">github.com/ryanatkn/cosmicplayground</a>
		</p>
	</Panel>
{/if}

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
