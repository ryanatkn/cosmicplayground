<script lang="ts">
	import {onMount} from 'svelte';
	import {writable} from 'svelte/store';
	import {type AsyncStatus} from '@feltcoop/felt';
	import {browser} from '$app/env';

	import PixiView from '$lib/app/PixiView.svelte';
	import PortalView from '$lib/app/PortalView.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import HomeButton from '$lib/app/HomeButton.svelte';
	import Panel from '$lib/app/Panel.svelte';
	import {set_router} from '$lib/app/routerStore';
	import {set_audio_ctx} from '$lib/audio/audioCtx';
	import {set_clock} from '$lib/app/clockStore';
	import {set_settings} from '$lib/app/settingsStore';
	import {set_portals, findPortalBySlug} from '$lib/app/portalsStore';
	import {trackIdleState} from '$lib/app/trackIdleState';
	import {updateRenderStats} from '$lib/app/renderStats';
	import {portalsData} from '$lib/portals/index';
	import {PixiApp, set_pixi} from '$lib/app/pixi';
	import {createPixiBgStore, type PixiBgStore} from '$lib/app/pixiBgStore';
	import WaitingScreen from '$lib/app/WaitingScreen.svelte';

	let width = browser ? window.innerWidth : 0;
	let height = browser ? window.innerHeight : 0;

	const settings = set_settings({
		audioEnabled: true, // TODO make this work everywhere? hmm. global mute/volume?
		devMode: false,
		recordingMode: false,
		idleMode: false,
		timeToGoIdle: 6000,
	});

	const clock = set_clock(); // TODO integrate with Pixi ticker?
	$: updateRenderStats($clock.dt);

	let supportsWebGL: boolean | null = null;
	let pixi: PixiApp;
	try {
		pixi = new PixiApp({width, height});
		supportsWebGL = true;
	} catch (err) {
		supportsWebGL = false; // usually probably correct to infer this
		pixi = {} as any; // TODO this is just a hack for type safety
		console.error(err);
	}
	set_pixi(pixi);

	const bgImageUrl = '/assets/space/galaxies.jpg';
	let bg: PixiBgStore;
	$: bg && bg.updateDimensions(width, height);
	$: bg && bg.tick($clock.dt);

	let loadingStatus: AsyncStatus = 'initial';
	const loadInitialResources = () => {
		pixi.loader.add(bgImageUrl).load(() => {
			bg = createPixiBgStore(pixi.loader.resources[bgImageUrl].texture, width, height);
			pixi.defaultScene.addChild($bg.sprite);
			loadingStatus = 'success';
		});
		loadingStatus = 'pending';
	};

	const router = set_router();

	const portals = set_portals(portalsData);
	$: activePortal = findPortalBySlug($portals, $router.slug);

	const idle = writable(false);
	$: timeToGoIdle = $settings.devMode
		? 99999999999
		: $settings.recordingMode
		? 500
		: $settings.timeToGoIdle;

	set_audio_ctx(); // allows components to do `const audioCtx = get_audio_ctx();` which uses svelte's `getContext`

	const enableGlobalHotkeys = (target: HTMLElement) => !target.closest('input');
	const onKeyDown = (e: KeyboardEvent) => {
		// TODO main menu!

		// toggle dev mode
		if (e.key === '`' && e.ctrlKey) {
			settings.update((s) => ({...s, devMode: !s.devMode}));
			console.log('dev mode is now', $settings.devMode);
		}
		// dev mode hotkeys
		if ($settings.devMode) {
			if (e.key === '`' && !e.ctrlKey && enableGlobalHotkeys(e.target as any)) {
				clock.toggle();
				console.log('clock is now', $clock.running ? 'running' : 'paused');
			} else if (e.key === '-' && !e.ctrlKey && enableGlobalHotkeys(e.target as any)) {
				settings.update((s) => ({...s, idleMode: !s.idleMode}));
				console.log('idle mode is now', $settings.idleMode);
			} else if (e.key === '=' && !e.ctrlKey && enableGlobalHotkeys(e.target as any)) {
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
	{#if loadingStatus !== 'success'}
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
			source code is at <a href="https://github.com/ryanatkn/cosmicplayground"
				>github.com/ryanatkn/cosmicplayground</a
			>
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
