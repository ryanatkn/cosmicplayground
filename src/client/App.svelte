<script>
	import {writable} from 'svelte/store';

	import {createClock} from './clock.js';
	import Panel from './Panel.svelte';
	import GalaxyBg from './GalaxyBg.svelte';
	import UnderConstruction from './UnderConstruction.svelte';
	import BundleVision from './BundleVision.svelte';
	import About from './About.svelte';
	import ClockControls from './ClockControls.svelte';
	import BackButton from './BackButton.svelte';
	import FreqSpeeds from './FreqSpeeds.svelte';
	import FreqSpectacle from './FreqSpectacle.svelte';
	import HearingTest from './HearingTest.svelte';
	import PaintFreqs from './PaintFreqs.svelte';
	import TransitionDesigner from './TransitionDesigner.svelte';
	import EasingViz from './EasingViz.svelte';
	import EasingAudViz from './EasingAudViz.svelte';
	import StarlitHammock from './StarlitHammock.svelte';
	import DeepBreath from './DeepBreath.svelte';
	import EarthThumbnail from './EarthThumbnail.svelte';
	import Clocks from './Clocks.svelte';
	import {mix} from '../utils/math.js';
	import {initAudioCtx} from '../audio/audioCtx.js';
	import {trackIdleState} from './trackIdleState.js';
	import {initSettings} from './settingsStore.js';

	export let windowWidth = window.innerWidth;
	export let windowHeight = window.innerHeight;

	export let clock = createClock();

	const settings = initSettings({
		audioEnabled: true,
		devMode: false,
		recordingMode: false,
		timeToGoIdle: 6000,
	});

	// views:
	// portals | about | freq-spectacle | freq-speeds | under-construction | bundle-vision | clocks |
	// hearing-test | transition-designer | easings-1 | easings-2 | paint-freqs
	// starlit-hammock | deep-breath
	let hash = typeof window === 'undefined' ? '' : window.location.hash;
	const DEFAULT_VIEW = 'portals';
	$: view = hash.slice(1) || DEFAULT_VIEW;
	const onHashChange = (e) => {
		hash = window.location.hash;
	};

	let showMorePortals = false; // toggle showing portals to the less interesting projects

	const isIdle = writable(false);
	$: timeToGoIdle = $settings.devMode ? 99999999999 : $settings.timeToGoIdle;

	const viewsWithGalaxyBg = new Set([
		'portals',
		'about',
		'freq-spectacle',
		'freq-speeds',
		'under-construction',
		'bundle-vision',
		'clocks',
		'hearing-test',
		'transition-designer',
		'easings-1',
		'easings-2',
		'paint-freqs',
		'deep-breath', // TODO hide this during the tour
	]);
	$: showGalaxyBg = viewsWithGalaxyBg.has(view);

	initAudioCtx(); // allows components to do `const audioCtx = useAudioCtx();` which uses svelte's `getContext`

	let easingAudVizCanvas;
	$: easingAudVizCanvas && drawEasingAudVizCanvas();
	const easingAudVizCanvasWidth = 240;
	const easingAudVizCanvasHeight = 24;
	const easingAudVizMouthSize = 16;
	const easingAudVizTailSize = 10;
	const drawEasingAudVizCanvas = () => {
		// TODO can remove these temp vars after refactoring into a standalone component - names should be shortened
		const canvas = easingAudVizCanvas;
		const width = easingAudVizCanvasWidth;
		const height = easingAudVizCanvasHeight;
		if (canvas.width !== width) canvas.width = width;
		if (canvas.height !== height) canvas.height = height;
		const ctx = canvas.getContext('2d');
		const lineWidth = 2;
		const h = height - lineWidth * 2;
		ctx.clearRect(0, 0, width, height);
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = 'hsla(220deg, 60%, 65%, 0.6)'; // could fade opacity in from the left
		ctx.moveTo(0, height / 2);
		for (let x = 1; x < width; x++) {
			const xDiv = mix(8, 3.75, x / width);
			const y = (Math.sin(x / xDiv) * h) / 2 + h / 2 + lineWidth;
			ctx.lineTo(x, y);
		}
		ctx.stroke();
	};

	const onKeyDown = (e) => {
		if ($settings.devMode && e.key === '`') {
			if (!e.target.closest('input')) clock.toggle();
		}
	};
</script>

<svelte:window
	bind:innerWidth={windowWidth}
	bind:innerHeight={windowHeight}
	on:hashchange={onHashChange}
	use:trackIdleState={{isIdle, timeToGoIdle, idleIntervalTime: 1000}}
	on:keydown={onKeyDown}
/>

{#if showGalaxyBg}
	<section class="bg w-100 z-0">
		<GalaxyBg running={$clock.running} width={windowWidth} height={windowHeight} />
	</section>
{/if}

{#if view === 'portals'}
	<section class="portals" class:paused={!$clock.running}>
		<nav class="thumbnails">
			<a class="thumbnail" href="#about">
				<div style="padding: 4px; display: flex; flex-direction: column; align-items: center;">
					<h1>cosmicplayground</h1>
					<div>
						<small>
							help
							<img
								src="assets/characters/cosm.png"
								alt="cosm"
								class="pixelated"
								style="opacity: 0.6; width: 16px; height: 16px; margin: 0 10px;"
							/>
							about
							<img
								src="assets/characters/cosm.png"
								alt="cosm"
								class="pixelated"
								style="opacity: 0.6; width: 16px; height: 16px; margin: 0 10px;"
							/>
							credits
						</small>
					</div>
				</div>
			</a>
			<a
				class="thumbnail thumbnail--deep-breath"
				href="#deep-breath"
				style="width: 326px; height: 166px;"
			>
				<EarthThumbnail
					width={320}
					height={160}
					animationDuration="45s"
					running={$clock.running}
					text="deep breath"
					styles="position: absolute;"
				/>
			</a>
			<a class="thumbnail" href="#paint-freqs">
				<div style="font-size: 20px; margin-bottom: 7px;">paint freqs</div>
				<div class="overflow-hidden" style="width: 192px; height: 192px; border-radius: 50%;">
					<img
						class="cosmic-kitty"
						src="assets/characters/cosmic-kitty.jpg"
						style="width: 192px; height: 192px;"
						alt="Cosmic Kitty"
					/>
				</div>
			</a>
			<a class="thumbnail" href="#starlit-hammock" style="width: 260px; height: 200px;">
				<div class="relative z-1">starlit hammock</div>
				<GalaxyBg
					width={260}
					height={200}
					opacity={0.6}
					animationDuration="45s"
					running={$clock.running}
				/>
			</a>
			<a class="thumbnail" href="#easings-2">
				<div>easing function audioizations and visualizations</div>
				<div class="easing-aud-viz-wrapper">
					<canvas bind:this={easingAudVizCanvas} />
					<div
						class="easing-aud-viz-mouth-wrapper"
						style="left: {-easingAudVizMouthSize / 2}px; top: {easingAudVizCanvasHeight / 2 - easingAudVizMouthSize / 2}px;
						width: {easingAudVizMouthSize}px; height: {easingAudVizMouthSize}px;"
					>
						<div
							class="easing-aud-viz-mouth"
							style="width: {easingAudVizMouthSize}px; height: {easingAudVizMouthSize}px;"
						/>
						<div
							class="easing-aud-viz-mouth"
							style="width: {easingAudVizMouthSize}px; height: {easingAudVizMouthSize}px;"
						/>
						<div
							style="width: {easingAudVizMouthSize}px; height: {easingAudVizMouthSize}px;
							border-radius: 50%;"
						/>
					</div>
					<div
						class="easing-aud-viz-tail-wrapper"
						style="right: {-easingAudVizTailSize / 2}px; top: {8 + easingAudVizCanvasHeight / 2 - easingAudVizTailSize / 2}px;
						width: {easingAudVizTailSize}px; height: {easingAudVizTailSize}px;"
					>
						<div
							class="easing-aud-viz-tail"
							style="width: {easingAudVizTailSize}px; height: {easingAudVizTailSize}px;"
						/>
						<div
							class="easing-aud-viz-tail"
							style="width: {easingAudVizTailSize}px; height: {easingAudVizTailSize}px;"
						/>
						<div
							style="width: {easingAudVizTailSize / 2}px; height: {easingAudVizTailSize / 2}px;
							border-radius: 50%;"
						/>
					</div>
				</div>
			</a>
			<a class="thumbnail" href="#easings-1">
				<div>easing function visualizations</div>
				<div class="easing-viz-slider-wrapper">
					<div class="easing-viz-slider-graphic" />
				</div>
			</a>
			<a class="thumbnail" href="#hearing-test">
				<div>🐶 hearing test 🐶</div>
				<div>
					<small style="color: hsla(40deg, 60%, 65%, 1);">🐾 🐕 beware ye, creature 🐕 🐾</small>
				</div>
			</a>
			<a class="thumbnail thumbnail--under-construction" href="#under-construction">
				<img
					src={$clock.running ? 'assets/construction/person-rock.gif' : 'assets/construction/person-rock-pause.png'}
					alt="under construction: person rock"
					style="width: 162px; height: 100px;"
					class="pixelated"
				/>
			</a>
			<div class="thumbnail" on:click={() => (showMorePortals = !showMorePortals)}>
				<div>
					show
					{#if showMorePortals}less{:else}more{/if}
				</div>
				<div>
					<img
						src="assets/earth/night_lights_1.png"
						alt="night lights of Africa, Europe, and the Middle East"
						style="width: 100px; height: 100px;"
						class="mr-2"
					/>
					<img
						src="assets/earth/night_lights_2.png"
						alt="night lights of the Americas"
						style="width: 100px; height: 100px;"
						class="mr-2"
					/>
					<img
						src="assets/earth/night_lights_3.png"
						alt="night lights of Asia and Australia"
						style="width: 100px; height: 100px;"
					/>
				</div>
			</div>
		</nav>
		{#if showMorePortals}
			<nav class="thumbnails">
				<!-- putting them in a separate div so showing them doesn't move the toggle,
				but this is begging for a better design with animations -->
				<a class="thumbnail" href="#freq-speeds" style="display: flex; flex-direction: column;">
					<FreqSpeeds
						elapsedTime={$clock.time}
						width={300}
						height={75}
						hzItems={[4]}
						lowestHzItemCount={2}
					/>
					<FreqSpeeds
						elapsedTime={$clock.time}
						width={300}
						height={75}
						hzItems={[4]}
						lowestHzItemCount={2}
						style="transform: rotate(180deg);"
					/>
				</a>
				<a class="thumbnail" href="#transition-designer">
					<div class="rotating-text">transition designer</div>
				</a>
				<a class="thumbnail" href="#bundle-vision">{'{ bundle vision }'}</a>
				<a class="thumbnail" href="#clocks">{'🕓 clocks 🕑'}</a>
				<a class="thumbnail" href="#freq-spectacle" style="display: flex;">
					<FreqSpectacle
						elapsedTime={$clock.time}
						width={150}
						height={75}
						hzItems={[2, 3, 4]}
						lowestHzItemCount={1}
					/>
				</a>
			</nav>
		{/if}
	</section>
{:else if view === 'about'}
	<section class="content" style="height: initial;">
		<div class="back-button-wrapper">
			<BackButton />
		</div>
		<Panel contentClasses="p-5">
			<About />
		</Panel>
	</section>
{:else if view === 'easings-2'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton />
		</div>
		<EasingAudViz />
	</section>
{:else if view === 'easings-1'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton />
		</div>
		<EasingViz />
	</section>
{:else if view === 'transition-designer'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton />
		</div>
		<TransitionDesigner />
	</section>
{:else if view === 'paint-freqs'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton />
		</div>
		<PaintFreqs />
	</section>
{:else if view === 'starlit-hammock'}
	<section class="content" class:cursor-none={$isIdle}>
		<div class="back-button-wrapper">
			<BackButton isIdle={$isIdle} />
		</div>
		<StarlitHammock width={windowWidth} height={windowHeight} />
	</section>
{:else if view === 'deep-breath'}
	<section class="content" class:cursor-none={$isIdle}>
		<DeepBreath {clock} width={windowWidth} height={windowHeight} {isIdle} />
	</section>
{:else if view === 'hearing-test'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton />
		</div>
		<HearingTest />
	</section>
{:else if view === 'freq-spectacle'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton isIdle={$isIdle} />
		</div>
		<!-- TODO refactor this lol. also, do wackier thingg with it. -->
		<div class="content" on:click={clock.toggle}>
			<FreqSpectacle
				width={windowWidth}
				height={windowHeight * 0.7}
				elapsedTime={$clock.time}
				lowestHzItemCount={2}
				hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
			/>
			<div style="display: flex; justify-content: center;">
				<div style="flex: 0; display: flex; flex-direction: column;">
					<FreqSpectacle
						width={windowWidth * 0.25}
						height={windowHeight * 0.15}
						style="transform: rotate(180deg);"
						elapsedTime={$clock.time}
						lowestHzItemCount={2}
						hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
					/>
					<FreqSpectacle
						width={windowWidth * 0.25}
						height={windowHeight * 0.15}
						elapsedTime={$clock.time}
						lowestHzItemCount={2}
						hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
					/>
				</div>
				<FreqSpectacle
					width={windowWidth * 0.5}
					height={windowHeight * 0.3}
					style="transform: rotate(180deg);"
					elapsedTime={$clock.time}
					lowestHzItemCount={2}
					hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
				/>
				<div style="flex: 0; display: flex; flex-direction: column;">
					<FreqSpectacle
						width={windowWidth * 0.25}
						height={windowHeight * 0.15}
						style="transform: rotate(180deg);"
						elapsedTime={$clock.time}
						lowestHzItemCount={2}
						hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
					/>
					<FreqSpectacle
						width={windowWidth * 0.25}
						height={windowHeight * 0.15}
						elapsedTime={$clock.time}
						lowestHzItemCount={2}
						hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
					/>
				</div>
			</div>
		</div>
	</section>
{:else if view === 'freq-speeds'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton isIdle={$isIdle} />
		</div>
		<div class="content" on:click={clock.toggle}>
			<FreqSpeeds
				width={windowWidth}
				height={windowHeight / 2}
				elapsedTime={$clock.time}
				lowestHzItemCount={2}
				hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
			/>
			<FreqSpeeds
				width={windowWidth}
				height={windowHeight / 2}
				style="transform: rotate(180deg);"
				elapsedTime={$clock.time}
				lowestHzItemCount={2}
				hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
			/>
		</div>
	</section>
{:else if view === 'bundle-vision'}
	<!-- // TODO path - see `src/project/paths.ts` for more -->
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton />
		</div>
		<BundleVision url="/bundle.stats.json" />
	</section>
{:else if view === 'clocks'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton />
		</div>
		<Clocks {clock} />
	</section>
{:else if view === 'under-construction'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton isIdle={$isIdle} />
		</div>
		<UnderConstruction running={$clock.running} />
	</section>
{:else}
	<section class="content" style="display: flex;">
		<Panel>
			<div class="back-button-wrapper">
				<BackButton />
			</div>
			<h2>unknown view: {view}</h2>
		</Panel>
	</section>
{/if}

<style>
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
	}
	.content {
		position: relative;
		z-index: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	h1 {
		margin-bottom: 5px;
		display: flex;
		align-items: center;
	}
	.paused {
		filter: grayscale();
	}
	.thumbnails {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		width: 100%; /* allows nesting without shared rows to let the toggle stay still */
	}
	.thumbnail {
		cursor: pointer;
		position: relative;
		z-index: 2;
		padding: 12px;
		border: var(--portal_border);
		border-radius: var(--portal_border_radius);
		margin: 12px;
		font-size: 20px;
		text-align: center;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: transform 0.06s ease-out;
		transform: scale3d(1, 1, 1);
	}
	.thumbnail:hover {
		transform: scale3d(1.03, 1.03, 1);
		border-style: double;
	}
	.thumbnail:active {
		border-style: dotted;
		transform: scale3d(1.09, 1.09, 1);
	}
	.thumbnail--under-construction img {
		animation: rotate-pulse 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
	}
	.paused .thumbnail--under-construction img {
		animation-play-state: paused;
	}
	@keyframes rotate-pulse {
		0% {
			transform: rotate3d(-0.51, 0.49, 0.19, 27deg) scale3d(0.85, 0.85, 0.85);
		}
		66% {
			transform: rotate3d(0.65, 0.06, -0.07, 40deg) scale3d(1.2, 1.2, 1.2);
		}
		100% {
			transform: rotate3d(-0.51, 0.49, 0.19, 27deg) scale3d(0.85, 0.85, 0.85);
		}
	}
	.thumbnail--deep-breath {
		border-color: #1b4780;
	}
	.easing-viz-slider-wrapper {
		margin-top: 3px;
		width: 300px;
		background-color: hsla(260deg, 60%, 65%, 0.15);
	}
	.easing-viz-slider-graphic {
		animation: easing-viz-slide 5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite alternate;
		width: 12px;
		height: 12px;
		background-color: var(--color_3);
	}
	.paused .easing-viz-slider-graphic {
		animation-play-state: paused;
	}
	@keyframes easing-viz-slide {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(288px, 0, 0);
		}
	}
	.easing-aud-viz-wrapper {
		position: relative;
		margin-top: 10px;
		animation: easing-aud-viz-wrapper-warp 5s cubic-bezier(0.86, 0, 0.07, 1) infinite alternate;
	}
	.paused .easing-aud-viz-wrapper {
		animation-play-state: paused;
	}
	@keyframes easing-aud-viz-wrapper-warp {
		0% {
			transform: scale3d(1, 1, 1);
		}
		100% {
			transform: scale3d(1.5, 1, 1);
		}
	}
	.easing-aud-viz-mouth-wrapper {
		position: absolute;
		animation: easing-aud-viz-dance 10s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
		transform-origin: middle middle;
	}
	.paused .easing-aud-viz-mouth-wrapper {
		animation-play-state: paused;
	}
	.easing-aud-viz-mouth {
		position: absolute;
		left: 0;
		top: 0;
		background-color: var(--color_2);
		animation: rotate-360 0.5s linear reverse infinite;
		transform-origin: middle middle;
	}
	.easing-aud-viz-mouth:nth-child(2) {
		animation: rotate-360 0.5s linear infinite;
	}
	.paused .easing-aud-viz-mouth {
		animation-play-state: paused;
	}
	.easing-aud-viz-tail-wrapper {
		position: absolute;
		animation: easing-aud-viz-dance 10s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
		transform-origin: middle middle;
	}
	.paused .easing-aud-viz-tail-wrapper {
		animation-play-state: paused;
	}
	.easing-aud-viz-tail {
		position: absolute;
		left: 0;
		top: 0;
		background-color: var(--color_2);
		animation: rotate-360 0.5s linear reverse infinite;
		transform-origin: middle middle;
	}
	.easing-aud-viz-tail:nth-child(2) {
		animation: rotate-360 0.5s linear infinite;
	}
	.paused .easing-aud-viz-tail {
		animation-play-state: paused;
	}
	@keyframes rotate-360 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes easing-aud-viz-dance {
		0% {
			transform: scale3d(0.15, 0.15, 1) rotate(-45deg);
		}
		50% {
			transform: scale3d(0.5, 0.5, 1) rotate(225deg);
		}
		100% {
			transform: scale3d(0.15, 0.15, 1) rotate(450deg);
		}
	}
	.rotating-text {
		animation: rotate-text 2.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite alternate;
	}
	.paused .rotating-text {
		animation-play-state: paused;
	}
	@keyframes rotate-text {
		0% {
			transform: rotate3d(-1.35, 4.06, -0.37, 22deg);
		}
		100% {
			transform: rotate3d(1.15, 4.06, -0.37, -18deg);
		}
	}
	.back-button-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
	}
	.cosmic-kitty {
		animation: rotate-kitty 2.5s cubic-bezier(0.77, 0, 0.18, 1) infinite alternate;
	}
	.paused .cosmic-kitty {
		animation-play-state: paused;
	}
	@keyframes rotate-kitty {
		0% {
			transform: rotate3d(0, 0, 1, -2deg);
		}
		100% {
			transform: rotate3d(0, 0, 1, 6deg);
		}
	}
</style>
