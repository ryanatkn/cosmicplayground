<script lang="ts">
	import {run} from 'svelte/legacy';

	import {spring} from 'svelte/motion';
	import {onDestroy} from 'svelte';
	import {lerp} from '@ryanatkn/belt/maths.js';
	import {swallow} from '@ryanatkn/belt/dom.js';
	import {dimensions_context} from '$lib/dimensions.js';

	import {audio_ctx_context} from '$lib/audio_ctx.js';
	import {volume_to_gain, SMOOTH_GAIN_TIME_CONSTANT} from '$lib/audio_helpers.js';

	const dimensions = dimensions_context.get();

	const audio_ctx = audio_ctx_context.get();

	let pointer_x = $state(-300);
	let pointer_y = $state(-300);

	const spotPosition = spring(
		{x: pointer_x, y: pointer_y},
		{
			stiffness: 0.08,
			damping: 0.32,
		},
	);

	let osc: OscillatorNode | undefined = $state();
	let gain: GainNode | undefined = $state();

	const freqMin = 0;
	const freqMax = 25000;
	const calcFreq = (value: number, max: number) => {
		return lerp(freqMin, freqMax, value / max);
	};

	const volumeMin = 0;
	const volumeMax = 1;
	const calcVolume = (value: number, max: number) => {
		return lerp(volumeMin, volumeMax, 1 - value / max);
	};

	const start = () => {
		if (osc) return;
		gain = audio_ctx.createGain();
		gain.gain.value = 0;
		gain.connect(audio_ctx.destination);
		osc = audio_ctx.createOscillator();
		osc.type = 'sine';
		osc.start();
		osc.connect(gain);
	};
	const stop = () => {
		if (!osc) return;
		gain!.gain.setTargetAtTime(0, audio_ctx.currentTime, SMOOTH_GAIN_TIME_CONSTANT);
		osc.stop(audio_ctx.currentTime + SMOOTH_GAIN_TIME_CONSTANT * 2);
		osc = undefined;
		gain = undefined;
	};

	onDestroy(stop);

	// TODO more cleanly handle touch/click - pointer events with polyfill for Safari? (probably using Svelte actions)
	// or maybe support multiple touches? yeah...that makes sense here.
	const pointerEventX = (e: TouchEvent | MouseEvent) =>
		'touches' in e && e.touches.length ? e.touches[0].clientX : (e as MouseEvent).clientX;
	const pointerEventY = (e: TouchEvent | MouseEvent) =>
		'touches' in e && e.touches.length ? e.touches[0].clientY : (e as MouseEvent).clientY;
	const handlePointerDown = (e: TouchEvent | MouseEvent) => {
		if (!('touches' in e) && e.button !== 0) return; // avoid eating mouse button on Chrome (but not FF?)
		swallow(e); // TODO should these not be called for mobile?
		start();
		pointer_x = pointerEventX(e);
		pointer_y = pointerEventY(e);
	};
	const handlePointerUp = (e: TouchEvent | MouseEvent) => {
		if (!audio_ctx || !osc) return;
		if (!('touches' in e) && e.button !== 0) return; // avoid eating mouse button on Chrome (but not FF?)
		swallow(e); // TODO should these not be called for mobile?
		stop();
	};
	const handlePointerMove = (e: TouchEvent | MouseEvent) => {
		if (!audio_ctx || !osc) return;
		swallow(e); // TODO should these not be called for mobile?
		pointer_x = pointerEventX(e);
		pointer_y = pointerEventY(e);
	};
	run(() => {
		void spotPosition.set({x: pointer_x, y: pointer_y});
	});
	let freq = $derived(
		pointer_x >= 0 && $dimensions.width ? calcFreq(pointer_x, $dimensions.width) : undefined,
	);
	let displayedFreq = $derived(freq === undefined ? '' : Math.round(freq));
	run(() => {
		if (osc && freq !== undefined) {
			osc.frequency.setValueAtTime(freq, audio_ctx.currentTime);
		}
	});
	let volume = $derived(
		pointer_y >= 0 && $dimensions.height ? calcVolume(pointer_y, $dimensions.height) : undefined,
	);
	let displayedVolume = $derived(volume === undefined ? '' : Math.round(volume * 100));
	run(() => {
		if (gain && volume !== undefined) {
			gain.gain.setTargetAtTime(
				volume_to_gain(volume),
				audio_ctx.currentTime,
				SMOOTH_GAIN_TIME_CONSTANT,
			);
		}
	});
</script>

<div class="hearing-test" style="width: {$dimensions.width}px; height: {$dimensions.height}px;">
	{#if $spotPosition}
		<svg class="absolute0 w-100 h-100 z-2">
			<filter id="blurOuter" height="200%" width="200%" y="-50%" x="-50%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="10" />
			</filter>
			<circle
				class="outer"
				cx={$spotPosition.x}
				cy={$spotPosition.y}
				r={20}
				filter="url(#blurOuter)"
			/>
			<circle class="inner" cx={$spotPosition.x} cy={$spotPosition.y} r={2} />
		</svg>
	{/if}
	{#if volume !== undefined}
		<div class="volume h-100 absolute z-1 t-0 flex items-center justify-start">
			<div>{displayedVolume}<span class="unit">%</span></div>
		</div>
	{/if}
	{#if freq !== undefined}
		<div class="freq absolute z-1 w-100 l-0 flex items-start justify-center">
			<div>{displayedFreq}<span class="unit">hz</span></div>
		</div>
	{/if}
	<!-- TODO better a11y -->
	<div
		role="none"
		class="absolute z-3 w-100 h-100"
		onmousedown={handlePointerDown}
		onmouseup={handlePointerUp}
		onmouseleave={handlePointerUp}
		onmousemove={handlePointerMove}
		ontouchstart={handlePointerDown}
		ontouchend={handlePointerUp}
		ontouchcancel={handlePointerUp}
		ontouchmove={handlePointerMove}
	></div>
</div>

<style>
	.hearing-test {
		position: relative;
		overflow: hidden;
	}
	circle.outer {
		fill: rgba(226, 182, 255, 0.4);
	}
	circle.inner {
		fill: rgb(226, 182, 255);
	}
	.volume {
		left: 20px;
		font-size: 50px;
		color: #fff;
	}
	.freq {
		bottom: 15px;
		font-size: 50px;
		color: #fff;
	}
	.unit {
		opacity: 0.6;
	}
</style>
