<script>
	import {onMount} from 'svelte';
	import {writable} from 'svelte/store';

	import {createClock} from './clock.js';
	import Overlay from './Overlay.svelte';
	import GalaxyBg from './GalaxyBg.svelte';
	import Construction from './Construction.svelte';
	import About from './About.svelte';
	import ClockControls from './ClockControls.svelte';
	import CommunityLinks from './CommunityLinks.svelte';
	import BackButton from './BackButton.svelte';
	import FreqSpeeds from './FreqSpeeds.svelte';
	import FreqSpectacle from './FreqSpectacle.svelte';
	import HearingTest from './HearingTest.svelte';
	import PaintFreqs from './PaintFreqs.svelte';
	import TransitionDesigner from './TransitionDesigner.svelte';
	import EasingViz from './EasingViz.svelte';
	import EasingAudViz from './EasingAudViz.svelte';
	import {mix} from '../utils/math.js';

	export let name;

	// TODO refactor all of this view code with proper routing
	export let view = writable('main'); // main | about | freqSpeeds0 | freqSpeeds1 | construction | hearingTest | transitionDesigner | easingViz | easingAudViz | paintFreqs

	export let windowWidth = window.innerWidth;
	export let windowHeight = window.innerHeight;

	export let clock = createClock();

	onMount(() => {
		drawEasingAudVizCanvas();
	});

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
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<section class="bg">
	<GalaxyBg running={$clock.running} />
</section>

{#if $view === 'main'}
	<section class="menu">
		<nav>
			<ul class="thumbnails">
				<li class="thumbnail" on:click={() => view.set('about')}>
					<div
						style="padding: 4px; display: flex; flex-direction: column;
						align-items: center;">
						<div style="font-size: 30px; margin: 20px 0;">{name}</div>
						<small>. help . about . credits .</small>
					</div>
				</li>
				<li class="thumbnail" on:click={() => view.set('paintFreqs')}>
					<div style="font-size: 20px; margin-bottom: 7px;">paint freqs</div>
					<div
						style="width: 192px; height: 192px; border-radius: 50%; overflow:
						hidden;">
						<img
							src="assets/characters/cosmic-kitty.jpg"
							style="width: 192px; height: 192px;"
							alt="Cosmic Kitty" />
					</div>
				</li>
				<li class="thumbnail" on:click={() => view.set('easingAudViz')}>
					<div>easing function audioizations and visualizations</div>
					<div class="easing-aud-viz-wrapper">
						<canvas bind:this={easingAudVizCanvas} />
						<div
							class="easing-aud-viz-mouth-wrapper"
							style="left: {-easingAudVizMouthSize / 2}px; top: {easingAudVizCanvasHeight / 2 - easingAudVizMouthSize / 2}px;
							width: {easingAudVizMouthSize}px; height: {easingAudVizMouthSize}px;">
							<div
								class="easing-aud-viz-mouth"
								style="width: {easingAudVizMouthSize}px; height: {easingAudVizMouthSize}px;" />
							<div
								class="easing-aud-viz-mouth"
								style="width: {easingAudVizMouthSize}px; height: {easingAudVizMouthSize}px;" />
							<div
								class="easing-aud-viz-mouth-void"
								style="width: {easingAudVizMouthSize}px; height: {easingAudVizMouthSize}px;
								border-radius: 50%;" />
						</div>
						<div
							class="easing-aud-viz-tail-wrapper"
							style="right: {-easingAudVizTailSize / 2}px; top: {8 + easingAudVizCanvasHeight / 2 - easingAudVizTailSize / 2}px;
							width: {easingAudVizTailSize}px; height: {easingAudVizTailSize}px;">
							<div
								class="easing-aud-viz-tail"
								style="width: {easingAudVizTailSize}px; height: {easingAudVizTailSize}px;" />
							<div
								class="easing-aud-viz-tail"
								style="width: {easingAudVizTailSize}px; height: {easingAudVizTailSize}px;" />
							<div
								class="easing-aud-viz-tail-void"
								style="width: {easingAudVizTailSize / 2}px; height: {easingAudVizTailSize / 2}px;
								border-radius: 50%;" />
						</div>
					</div>
				</li>
				<li class="thumbnail" on:click={() => view.set('easingViz')}>
					<div>easing function visualizations</div>
					<div class="easing-viz-slider-wrapper">
						<div class="easing-viz-slider-graphic" />
					</div>
				</li>
				<li class="thumbnail" on:click={() => view.set('transitionDesigner')}>
					<div class="rotating-text">transition designer</div>
				</li>
				<li class="thumbnail" on:click={() => view.set('hearingTest')}>
					<div>🐶 hearing test 🐶</div>
					<div>
						<small style="color: hsla(40deg, 60%, 65%, 1);">
							🐾 🐕 beware ye, creature 🐕 🐾
						</small>
					</div>
				</li>
				<li
					class="thumbnail"
					on:click={() => view.set('freqSpeeds1')}
					style="display: flex; flex-direction: column;">
					<FreqSpeeds
						elapsedTime={$clock.time}
						width={300}
						height={75}
						hzItems={[4]}
						lowestHzItemCount={2} />
					<FreqSpeeds
						elapsedTime={$clock.time}
						width={300}
						height={75}
						hzItems={[4]}
						lowestHzItemCount={2}
						style="transform: rotate(180deg);" />
				</li>
				<li
					class="thumbnail"
					on:click={() => view.set('freqSpeeds0')}
					style="display: flex;">
					<FreqSpectacle
						elapsedTime={$clock.time}
						width={150}
						height={75}
						hzItems={[2, 3]}
						lowestHzItemCount={1} />
					<FreqSpectacle
						elapsedTime={$clock.time}
						width={150}
						height={75}
						hzItems={[5, 4]}
						lowestHzItemCount={1}
						style="transform: rotate(180deg);" />
				</li>
				<li class="thumbnail" on:click={() => view.set('construction')}>
					{#if $clock.running}
						<img
							src="assets/construction/person-rock.gif"
							alt="under construction: person rock"
							style="width: 162px; height: 100px;"
							class="pixelated thumbnail-construction" />
					{:else}
						<img
							src="assets/construction/person-rock-pause.png"
							alt="under construction: person rock"
							style="width: 162px; height: 100px; filter: grayscale(100%);"
							class="pixelated" />
					{/if}
				</li>
			</ul>
		</nav>
	</section>
{:else if $view === 'about'}
	<section
		class="content"
		on:click={() => view.set('main')}
		style="padding: 20px;">
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<div style="margin: 90px auto 0; max-width: 980px; padding: 20px;">
			<Overlay contentStyle="padding: 20px;">
				<About {name}>
					<div style="display: flex; align-items: center;">
						<div
							style="padding: 12px; border: 3px dashed rgba(0, 0, 0, 0.3);
							background: rgba(0, 0, 0, 0.15); display: flex;">
							<ClockControls
								time={$clock.time}
								running={$clock.running}
								pause={clock.pause}
								resume={clock.resume} />
						</div>
					</div>
				</About>
			</Overlay>
		</div>
	</section>
{:else if $view === 'easingAudViz'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<EasingAudViz />
	</section>
{:else if $view === 'easingViz'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<EasingViz />
	</section>
{:else if $view === 'transitionDesigner'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<TransitionDesigner />
	</section>
{:else if $view === 'paintFreqs'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<PaintFreqs />
	</section>
{:else if $view === 'hearingTest'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<HearingTest />
	</section>
{:else if $view === 'freqSpeeds0'}
	<section class="content" on:click={clock.toggle}>
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<FreqSpectacle
			width={windowWidth}
			height={windowHeight * 0.7}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]} />
		<div style="display: flex; justify-content: center;">
			<div style="flex: 0; display: flex; flex-direction: column;">
				<FreqSpectacle
					width={windowWidth * 0.25}
					height={windowHeight * 0.15}
					style="transform: rotate(180deg);"
					elapsedTime={$clock.time}
					lowestHzItemCount={2}
					hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]} />
				<FreqSpectacle
					width={windowWidth * 0.25}
					height={windowHeight * 0.15}
					elapsedTime={$clock.time}
					lowestHzItemCount={2}
					hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]} />
			</div>
			<FreqSpectacle
				width={windowWidth * 0.5}
				height={windowHeight * 0.3}
				style="transform: rotate(180deg);"
				elapsedTime={$clock.time}
				lowestHzItemCount={2}
				hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]} />
			<div style="flex: 0; display: flex; flex-direction: column;">
				<FreqSpectacle
					width={windowWidth * 0.25}
					height={windowHeight * 0.15}
					style="transform: rotate(180deg);"
					elapsedTime={$clock.time}
					lowestHzItemCount={2}
					hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]} />
				<FreqSpectacle
					width={windowWidth * 0.25}
					height={windowHeight * 0.15}
					elapsedTime={$clock.time}
					lowestHzItemCount={2}
					hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]} />
			</div>
		</div>
	</section>
{:else if $view === 'freqSpeeds1'}
	<section class="content" on:click={clock.toggle}>
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<FreqSpeeds
			width={windowWidth}
			height={windowHeight / 2}
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]} />
		<FreqSpeeds
			width={windowWidth}
			height={windowHeight / 2}
			style="transform: rotate(180deg);"
			elapsedTime={$clock.time}
			lowestHzItemCount={2}
			hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]} />
	</section>
{:else if $view === 'construction'}
	<section class="content">
		<div class="back-button-wrapper">
			<BackButton {view} />
		</div>
		<Construction running={$clock.running} />
	</section>
{:else}
	<section
		class="content"
		style="display: flex;"
		on:click={() => view.set('main')}>
		<Overlay>
			<div class="back-button-wrapper">
				<BackButton {view} />
			</div>
			<h2>unknown view: {$view}</h2>
		</Overlay>
	</section>
{/if}

<style>
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
	.content {
		position: relative;
		z-index: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.thumbnails {
		list-style-type: none;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
	.thumbnail {
		cursor: pointer;
		position: relative;
		z-index: 2;
		padding: 12px;
		border: 3px dashed rgba(255, 255, 255, 0.3);
		border-radius: 2px;
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
		transform: scale3d(1.06, 1.06, 1);
		border-width: 5px;
		padding: 10px;
		/* TODO the padding needs to be reduced as the border increases - should do this with some code instead of manually - PostCSS? */
	}
	.thumbnail:active {
		border-style: dotted;
		transform: scale3d(0.93, 0.93, 1);
	}
	.thumbnail-construction {
		animation: rotate-pulse 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
	}
	@keyframes rotate-pulse {
		0% {
			transform: rotate3d(-0.51, 0.49, 0.19, 27deg);
		}
		66% {
			transform: rotate3d(0.65, 0.06, -0.07, 40deg) scale3d(1.12, 1.12, 1.12);
		}
		100% {
			transform: rotate3d(-0.51, 0.49, 0.19, 27deg);
		}
	}
	.easing-viz-slider-wrapper {
		margin-top: 3px;
		width: 300px;
		background-color: hsla(260deg, 60%, 65%, 0.15);
	}
	.easing-viz-slider-graphic {
		animation: easing-viz-slide 5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite
			alternate;
		width: 12px;
		height: 12px;
		background-color: hsla(260deg, 60%, 65%, 1);
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
	}
	.easing-aud-viz-mouth-wrapper {
		position: absolute;
		animation: easing-aud-viz-dance 5s cubic-bezier(0.785, 0.135, 0.15, 0.86)
			infinite;
		transform-origin: middle middle;
	}
	.easing-aud-viz-mouth {
		position: absolute;
		left: 0;
		top: 0;
		background-color: hsla(220deg, 60%, 65%, 1);
		animation: rotate-360 0.5s linear reverse infinite;
		transform-origin: middle middle;
	}
	.easing-aud-viz-mouth:nth-child(2) {
		animation: rotate-360 0.5s linear infinite;
	}
	.easing-aud-viz-tail-wrapper {
		position: absolute;
		animation: easing-aud-viz-dance 10s cubic-bezier(0.785, 0.135, 0.15, 0.86)
			infinite;
		transform-origin: middle middle;
	}
	.easing-aud-viz-tail {
		position: absolute;
		left: 0;
		top: 0;
		background-color: hsla(220deg, 60%, 65%, 1);
		animation: rotate-360 0.5s linear reverse infinite;
		transform-origin: middle middle;
	}
	.easing-aud-viz-tail:nth-child(2) {
		animation: rotate-360 0.5s linear infinite;
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
			transform: scale3d(0.15, 0.15, 0.15) rotate(-45deg);
		}
		50% {
			transform: scale3d(1, 1, 1) rotate(225deg);
		}
		100% {
			transform: scale3d(0.15, 0.15, 0.15) rotate(450deg);
		}
	}
	.rotating-text {
		animation: rotate-text 2.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite
			alternate;
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

	:global(*) {
		/* before/after? normalize.css? */
		box-sizing: border-box;
	}

	:global(html) {
		height: 100%;
		padding: 0;
		margin: 0;
		font-family: sans-serif;
	}
	:global(body) {
		height: 100%;
		padding: 0;
		margin: 0;
		background-color: #000;
	}
	:global(#root) {
		height: 100%;
		position: relative;
	}

	:global(.pixelated) {
		image-rendering: -webkit-optimize-contrast; /* Safari */
		image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
		image-rendering: pixelated; /* in case crisp-edges isn't supported */
		image-rendering: crisp-edges; /* the recommended pixel art setting according to MDN */
	}
</style>
