<script lang="ts">
	import '@ryanatkn/moss/style.css';
	import '@ryanatkn/moss/theme.css';
	import '$lib/style.css';
	import '$lib/style-utilities.css';

	import Themed from '@ryanatkn/fuz/Themed.svelte';
	import {sync_color_scheme} from '@ryanatkn/fuz/theme.svelte.js';
	import {onMount} from 'svelte';
	import type {Async_Status} from '@ryanatkn/belt/async.js';
	import {writable} from 'svelte/store';
	import {page} from '$app/stores';
	import {beforeNavigate, goto} from '$app/navigation';
	import {swallow} from '@ryanatkn/belt/dom.js';
	import {Assets} from '@pixi/assets';
	import {base} from '$app/paths';
	import {BROWSER} from 'esm-env';

	import {clock_context} from '$lib/clock.js';
	import {enable_global_hotkeys} from '$lib/dom.js';
	import {idle_context, track_idle_state} from '$lib/idle.js';
	import {createPixiBgStore, type PixiBgStore} from '$lib/pixiBg.js';
	import {PixiApp, set_pixi} from '$lib/pixi.js';
	import PixiView from '$lib/PixiView.svelte';
	import Hud from '$lib/Hud.svelte';
	import HomeButton from '$lib/HomeButton.svelte';
	import Panel from '$lib/Panel.svelte';
	import {set_settings} from '$lib/settings.js';
	import {set_portals, create_portals_store} from '$lib/portals.js';
	import {update_render_stats} from '$lib/renderStats.js';
	import {portals_data} from '$lib/portals_data.js';
	import WaitingScreen from '$lib/WaitingScreen.svelte';
	import {set_audio_ctx} from '$lib/audio_ctx.js';
	import {App_Dialog_State, app_dialog_context} from '$lib/app_dialog.js';
	import AppDialogs from '$lib/AppDialogs.svelte';
	import AppDialog from '$lib/AppDialog.svelte';
	import AppDialogMenu from '$lib/AppDialogMenu.svelte';
	import {playing_song, muted, volume} from '$lib/play_song.js';
	import {dimensions_context} from '$lib/dimensions.js';

	const selected_color_scheme = writable('dark' as const);
	sync_color_scheme($selected_color_scheme); // TODO probably shouldn't be needed

	const clock = clock_context.set();

	const app_dialog = app_dialog_context.set(new App_Dialog_State(clock));

	beforeNavigate(() => {
		app_dialog.close();
	});

	let supports_webgl: boolean | null = null;

	const pixi = new PixiApp();
	console.log(`pixi`, pixi);

	const dimensions = dimensions_context.set(
		writable(
			BROWSER ? {width: window.innerWidth, height: window.innerHeight} : {width: 0, height: 0},
		),
	);

	set_pixi(pixi);

	const bgImageUrl = base + '/assets/space/galaxies.jpg';
	let bg: PixiBgStore;
	$: bg?.update_dimensions($dimensions.width, $dimensions.height);
	$: bg?.tick($clock.dt);

	let loadingStatus: Async_Status = 'initial';

	onMount(async () => {
		const redirecting = check_legacy_hash_redirect();
		if (redirecting) await redirecting;

		loadingStatus = 'pending';

		try {
			pixi.init({width: $dimensions.width, height: $dimensions.height, sharedTicker: true}); // TODO do the dimensions need to be reactive?
			supports_webgl = true;
		} catch (err) {
			console.error('failed to create PixiApp', err);
			supports_webgl = false; // usually probably correct to infer this
			console.error(err);
		}
		const bg_image_texture = await Assets.load(bgImageUrl);
		bg = createPixiBgStore(bg_image_texture, $dimensions.width, $dimensions.height);
		pixi.default_scene.addChild($bg.sprite);
		loadingStatus = 'success';
	});

	// We used to have routes like `/#deep-breath` and now it's just `/deep-breath`,
	// so this redirects to the hashless route as needed.
	const check_legacy_hash_redirect = (): Promise<void> | undefined => {
		const {hash} = window.location;
		if (!hash) return;
		window.location.hash = '';
		return goto('/' + hash.substring(1), {replaceState: true});
	};

	const settings = set_settings({
		audio_enabled: true,
		dev_mode: false,
		recording_mode: false,
		idle_mode: false,
		time_to_go_idle: 6000,
	});
	// TODO refactor `settings` with this stuff -- granular stores seems better these days
	$: audio_el = $playing_song?.audio_el;
	$: if (audio_el) {
		audio_el.volume = $muted ? 0 : $volume!;
	}
	$: if (audio_el) {
		audio_el.volume = $muted ? 0 : volume ? $volume! : 1;
	}

	clock.resume();
	$: update_render_stats($clock.dt);

	// TODO We want to do this to avoid unnecessary rendering when the app is paused,
	// but the problem is it breaks some experiences like soggy planet.
	// One fix would be to detect a stopped ticker and render on user input,
	// but that seems tedious and error prone.
	// $: if (pixi.app) {
	// 	if ($clock.running) {
	// 		if (!pixi.app.ticker.started) {
	// 			pixi.app.ticker.start();
	// 			// TODO or this?
	// 			// pixi.ticker.start();
	// 		}
	// 	} else {
	// 		if (pixi.app.ticker.started) {
	// 			pixi.app.ticker.stop();
	// 			// TODO or this?
	// 			// pixi.ticker.stop();
	// 		}
	// 	}
	// }

	const portals = create_portals_store({
		data: portals_data,
		selected_portal: portals_data.portals_by_slug.get($page.url.pathname.substring(1)) || null,
	});
	set_portals(portals);
	$: selected_portalSlugFromPath = $page.url.pathname.substring(1).split('/')[0];
	$: portals.select(selected_portalSlugFromPath); // TODO hmm?

	const idle = idle_context.set(writable(false));

	$: time_to_go_idle = $settings.dev_mode
		? 99999999999
		: $settings.recording_mode
			? 500
			: $settings.time_to_go_idle;
	set_audio_ctx(); // allows components to do `const audio_ctx = get_audio_ctx();` which uses svelte's `getContext`

	// TODO integrate this with the controls in `index.svelte` and `World.svelte`
	const onKeyDown = async (e: KeyboardEvent) => {
		// TODO main menu!
		const {key, target} = e;
		console.log(`key`, key);
		if (key === '`' && !e.ctrlKey && enable_global_hotkeys(target)) {
			// global pause
			swallow(e);
			clock.toggle();
		} else if (key === '`' && e.ctrlKey && enable_global_hotkeys(target)) {
			// toggle dev mode
			swallow(e);
			settings.update((s) => ({...s, dev_mode: !s.dev_mode}));
		} else if (key === 'Escape' && !e.shiftKey && enable_global_hotkeys(e.currentTarget)) {
			swallow(e);
			app_dialog.toggle();
		} else if (key === 'Escape' && e.shiftKey && enable_global_hotkeys(target)) {
			// global nav up one - I'd choose `ctrlKey` but it's taken by the OS
			swallow(e);
			await goto($page.url.pathname.split('/').slice(0, -1).join('/') || '/');
		} else if (e.key === '!' && e.ctrlKey && enable_global_hotkeys(target)) {
			if ($page.url.pathname !== '/unlock/atlas') {
				swallow(e);
				await goto('/unlock/atlas');
			}
		} else if (key === '-' && !e.ctrlKey && enable_global_hotkeys(target)) {
			swallow(e);
			settings.update((s) => ({...s, idle_mode: !s.idle_mode}));
			console.log('idle mode is now', $settings.idle_mode);
		} else if (key === '=' && !e.ctrlKey && enable_global_hotkeys(target)) {
			swallow(e);
			settings.update((s) => ({...s, recording_mode: !s.recording_mode}));
			console.log('recording mode is now', $settings.recording_mode);
		}
	};
</script>

<svelte:head>
	<title>cosmicplayground</title>
</svelte:head>

<svelte:window
	on:resize={() => ($dimensions = {width: window.innerWidth, height: window.innerHeight})}
	use:track_idle_state={{idle, time_to_go_idle, idle_interval_time: 1000}}
	on:keydown={onKeyDown}
/>

<Themed {selected_color_scheme} color_scheme_fallback={$selected_color_scheme}>
	{#if supports_webgl}
		{#if loadingStatus !== 'success'}
			<WaitingScreen status={loadingStatus} />
		{:else}
			<div
				class="pixi-wrapper fade-in"
				style="width: {$dimensions.width}px; height: {$dimensions.height}px;"
			>
				<PixiView {pixi} width={$dimensions.width} height={$dimensions.height} />
			</div>
			<main
				class="fade-in"
				class:paused={!$clock.running}
				class:secret={$settings.secret_enabled}
				class:idle={$idle || $settings.idle_mode}
			>
				{#if !$portals.selected_portal || $portals.selected_portal.showHomeButton}
					<Hud>
						<HomeButton />
					</Hud>
				{/if}
				<slot />
			</main>
			<AppDialogs />
			<AppDialog>
				<AppDialogMenu />
			</AppDialog>
		{/if}
	{:else if supports_webgl === null}
		<!-- render nothing yet -->
	{:else}
		<Panel>
			<h1>blip :(</h1>
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
</Themed>

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
	.paused:not(.secret) {
		filter: grayscale();
	}
</style>
