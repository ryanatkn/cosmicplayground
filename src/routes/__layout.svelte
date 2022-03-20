<script lang="ts">
	import '$lib/app/style.css';
	import '$lib/app/style-utilities.css';
	import {onMount} from 'svelte';
	import type {AsyncStatus} from '@feltcoop/felt';
	import {browser} from '$app/env';
	import {writable} from 'svelte/store';
	import {page} from '$app/stores';
	import {goto} from '$app/navigation';
	import {isEditable} from '@feltcoop/felt/util/dom.js';

	import {createPixiBgStore, type PixiBgStore} from '$lib/app/pixiBgStore';
	import {PixiApp, setPixi} from '$lib/app/pixi';
	import {setIdle, trackIdleState} from '$lib/app/trackIdleState';
	import PixiView from '$lib/app/PixiView.svelte';
	import Hud from '$lib/app/Hud.svelte';
	import HomeButton from '$lib/app/HomeButton.svelte';
	import Panel from '$lib/app/Panel.svelte';
	import {setClock} from '$lib/app/clockStore';
	import {setSettings} from '$lib/app/settingsStore';
	import {setPortals, createPortalsStore} from '$lib/app/portalsStore';
	import {updateRenderStats} from '$lib/app/renderStats';
	import {portalsData} from '$lib/portals/index';
	import WaitingScreen from '$lib/app/WaitingScreen.svelte';
	import {setAudioCtx} from '$lib/audio/audioCtx';
	import {setDimensions} from '$lib/app/dimensions';

	const dimensions = writable({
		width: browser ? window.innerWidth : 1,
		height: browser ? window.innerHeight : 1,
	});
	setDimensions(dimensions);

	let supportsWebGL: boolean | null = null;

	let pixi = new PixiApp();

	setPixi(pixi);

	const bgImageUrl = '/assets/space/galaxies.jpg';
	let bg: PixiBgStore;
	$: bg?.updateDimensions($dimensions.width, $dimensions.height);
	$: bg?.tick($clock.dt);

	let loadingStatus: AsyncStatus = 'initial';

	onMount(async () => {
		const redirecting = checkLegacyHashRedirect();
		if (redirecting) await redirecting;

		loadingStatus = 'pending';
		// TODO importing PIXI async due to this issue: https://github.com/sveltejs/kit/issues/1650
		const pixiModule = await import('pixi.js');
		try {
			pixi.init(pixiModule, {width: $dimensions.width, height: $dimensions.height}); // TODO do the dimensions need to be reactive?
			supportsWebGL = true;
		} catch (err) {
			console.error('failed to create PixiApp', err);
			supportsWebGL = false; // usually probably correct to infer this
			pixi = {} as any; // TODO this is just a hack for type safety
			console.error(err);
		}
		pixi.app.loader.add(bgImageUrl).load(() => {
			bg = createPixiBgStore(
				pixi.PIXI,
				pixi.app.loader.resources[bgImageUrl].texture!,
				$dimensions.width,
				$dimensions.height,
			);
			pixi.defaultScene.addChild($bg.sprite);
			loadingStatus = 'success';
		});
	});

	// We used to have routes like `/#deep-breath` and now it's just `/deep-breath`,
	// so this redirects to the hashless route as needed.
	const checkLegacyHashRedirect = (): Promise<void> | undefined => {
		const {hash} = window.location;
		if (!hash) return;
		window.location.hash = '';
		return goto('/' + hash.substring(1), {replaceState: true});
	};

	const settings = setSettings({
		audioEnabled: true, // TODO make this work everywhere? hmm. global mute/volume?
		devMode: false,
		recordingMode: false,
		idleMode: false,
		timeToGoIdle: 6000,
	});

	const clock = setClock(); // TODO integrate with Pixi ticker?
	clock.resume();
	$: updateRenderStats($clock.dt);

	const portals = createPortalsStore({
		data: portalsData,
		selectedPortal: portalsData.portalsBySlug.get($page.url.pathname.substring(1)) || null,
	});
	setPortals(portals);
	$: selectedPortalSlugFromPath = $page.url.pathname.substring(1);
	$: portals.select(selectedPortalSlugFromPath); // TODO hmm?

	const idle = writable(false);
	setIdle(idle);
	$: timeToGoIdle = $settings.devMode
		? 99999999999
		: $settings.recordingMode
		? 500
		: $settings.timeToGoIdle;
	setAudioCtx(); // allows components to do `const audioCtx = getAudioCtx();` which uses svelte's `getContext`

	const enableGlobalHotkeys = (target: HTMLElement) => !isEditable(target);
	const onKeyDown = (e: KeyboardEvent) => {
		// TODO main menu!

		if (e.key === '`' && !e.ctrlKey && enableGlobalHotkeys(e.target as any)) {
			clock.toggle();
		}

		// toggle dev mode
		if (e.key === '`' && e.ctrlKey) {
			settings.update((s) => ({...s, devMode: !s.devMode}));
			console.log('dev mode is now', $settings.devMode);
		}
		// dev mode hotkeys
		if ($settings.devMode) {
			if (e.key === '-' && !e.ctrlKey && enableGlobalHotkeys(e.target as any)) {
				settings.update((s) => ({...s, idleMode: !s.idleMode}));
				console.log('idle mode is now', $settings.idleMode);
			} else if (e.key === '=' && !e.ctrlKey && enableGlobalHotkeys(e.target as any)) {
				settings.update((s) => ({...s, recordingMode: !s.recordingMode}));
				console.log('recording mode is now', $settings.recordingMode);
			}
		}
	};
</script>

<svelte:head>
	<title>cosmicplayground</title>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<svelte:window
	on:resize={() => ($dimensions = {width: window.innerWidth, height: window.innerHeight})}
	use:trackIdleState={{idle, timeToGoIdle, idleIntervalTime: 1000}}
	on:keydown={onKeyDown}
/>

{#if supportsWebGL}
	{#if loadingStatus !== 'success'}
		<WaitingScreen status={loadingStatus} />
	{:else}
		<div
			class="pixi-wrapper fade-in"
			style="width: {$dimensions.width}px; height: {$dimensions.height}px;"
		>
			<PixiView {pixi} width={$dimensions.width} height={$dimensions.height} />
		</div>
		<main class="fade-in" class:paused={!$clock.running} class:idle={$idle || $settings.idleMode}>
			{#if !$portals.selectedPortal || $portals.selectedPortal.showHomeButton}
				<Hud>
					<HomeButton />
				</Hud>
			{/if}
			<slot />
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
		min-height: 100%;
		z-index: 1;
		display: flex;
		flex-direction: column;
	}
	.paused {
		filter: grayscale();
	}
</style>
