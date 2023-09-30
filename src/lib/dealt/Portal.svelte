<script lang="ts">
	import {onMount} from 'svelte';
	import {writable, type Writable} from 'svelte/store';
	import {swallow} from '@grogarden/util/dom.js';
	import type {AsyncStatus} from '@grogarden/util/async.js';
	import {goto} from '$app/navigation';
	import * as Pixi from 'pixi.js';
	import {page} from '$app/stores';

	import {setIdle, trackIdleState} from './trackIdleState';
	import {set_dimensions, type Dimensions} from './dimensions';
	import {set_clock} from './clock';
	import {setSettings} from './settings';
	import PixiView from './PixiView.svelte';
	import WaitingScreen from './WaitingScreen.svelte';
	import {PixiApp, setPixi} from './pixi';
	import {updateRenderStats} from './renderStats';
	import {enable_global_hotkeys} from './dom';
	import {showAppDialog} from './appDialog';
	import AppDialogs from './AppDialogs.svelte';
	import AppDialog from './AppDialog.svelte';
	import AppDialogMenu from './AppDialogMenu.svelte';

	export const dimensions: Writable<Dimensions> = writable({width: 0, height: 0});
	set_dimensions(dimensions);
	let clientWidth: number;
	let clientHeight: number;
	$: $dimensions = {width: clientWidth, height: clientHeight};
	$: console.log(`$dimensions`, $dimensions);

	let supportsWebGL: boolean | null = null;

	let pixi = new PixiApp();
	(window as any).p = pixi;
	setPixi(pixi);

	let loadingStatus: AsyncStatus = 'initial';

	onMount(async () => {
		loadingStatus = 'pending';

		(window as any).pixi = Pixi as any;
		try {
			pixi.init({width: $dimensions.width, height: $dimensions.height, sharedTicker: true}); // TODO do the dimensions need to be reactive?
			supportsWebGL = true;
		} catch (err) {
			console.error('failed to create PixiApp', err);
			supportsWebGL = false; // usually probably correct to infer this
			pixi = {} as any; // TODO this is just a hack for type safety
			console.error(err);
		}
		loadingStatus = 'success';
	});

	const settings = setSettings({
		audioEnabled: true, // TODO make this work everywhere? hmm. global mute/volume?
		devMode: false,
		recordingMode: false,
		idleMode: false,
		timeToGoIdle: 6000,
	});

	const clock = set_clock(); // TODO integrate with Pixi ticker?
	clock.resume();
	$: updateRenderStats($clock.dt);

	const idle = writable(false);
	setIdle(idle);
	$: timeToGoIdle = $settings.devMode
		? 99999999999
		: $settings.recordingMode
		? 500
		: $settings.timeToGoIdle;

	// TODO integrate this with the controls in `index.svelte` and `World.svelte`
	const onKeyDown = async (e: KeyboardEvent) => {
		// TODO main menu!
		const {key, target} = e;
		if (key === '`' && !e.ctrlKey && enable_global_hotkeys(target)) {
			// global pause
			swallow(e);
			clock.toggle();
		} else if (key === '`' && e.ctrlKey) {
			// toggle dev mode
			swallow(e);
			settings.update((s) => ({...s, devMode: !s.devMode}));
		} else if (key === 'Escape' && !e.shiftKey && enable_global_hotkeys(e.currentTarget)) {
			swallow(e);
			if ($showAppDialog) {
				$showAppDialog = false;
				clock.resume(); // TODO make this add to a stack so we can safely unpause
			} else {
				$showAppDialog = true;
				clock.pause(); // TODO make this add to a stack so we can safely unpause
			}
		} else if (key === 'Escape' && e.shiftKey) {
			// global nav up one
			swallow(e);
			await goto($page.url.pathname.split('/').slice(0, -1).join('/') || '/');
		} else if ($settings.devMode) {
			// dev mode hotkeys
			if (key === '-' && !e.ctrlKey && enable_global_hotkeys(target)) {
				swallow(e);
				settings.update((s) => ({...s, idleMode: !s.idleMode}));
				console.log('idle mode is now', $settings.idleMode);
			} else if (key === '=' && !e.ctrlKey && enable_global_hotkeys(target)) {
				swallow(e);
				settings.update((s) => ({...s, recordingMode: !s.recordingMode}));
				console.log('recording mode is now', $settings.recordingMode);
			}
		}
	};
</script>

<!-- TODO make this not hardcoded to the window -->
<svelte:window
	use:trackIdleState={{idle, timeToGoIdle, idleIntervalTime: 1000}}
	on:keydown={onKeyDown}
/>

<div class="portal" bind:clientWidth bind:clientHeight>
	{#if supportsWebGL}
		{#if loadingStatus !== 'success'}
			<WaitingScreen status={loadingStatus} />
		{:else}
			<div
				class="pixi-wrapper"
				style="width: {$dimensions.width}px; height: {$dimensions.height}px;"
			>
				<PixiView {pixi} width={$dimensions.width} height={$dimensions.height} />
			</div>
			<main
				class:paused={!$clock.running}
				class:secret={$settings.secretEnabled}
				class:idle={$idle || $settings.idleMode}
			>
				<slot />
			</main>
			<AppDialogs />
			<AppDialog>
				<AppDialogMenu />
			</AppDialog>
		{/if}
	{:else if supportsWebGL === null}
		<!-- render nothing yet -->
	{:else}
		<div class="markup panel padded-md">
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
		</div>
	{/if}
</div>

<style>
	.portal {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
