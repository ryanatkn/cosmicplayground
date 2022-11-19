<script lang="ts">
	import {spring} from 'svelte/motion';
	import {onDestroy} from 'svelte';
	import {lerp} from '@feltcoop/util/maths.js';
	import {swallow} from '@feltcoop/util/dom.js';

	import {getAudioCtx} from '$lib/audio/audioCtx';
	import {volumeToGain, SMOOTH_GAIN_TIME_CONSTANT} from '$lib/audio/utils';
	import {getDimensions} from '$lib/app/dimensions';

	const dimensions = getDimensions();

	const audioCtx = getAudioCtx();

	let pointerX = -300;
	let pointerY = -300;

	const spotPosition = spring(
		{x: pointerX, y: pointerY},
		{
			stiffness: 0.08,
			damping: 0.32,
		},
	);
	$: void spotPosition.set({x: pointerX, y: pointerY});

	let osc: OscillatorNode | undefined;
	let gain: GainNode | undefined;

	$: freq = pointerX >= 0 && $dimensions.width ? calcFreq(pointerX, $dimensions.width) : undefined;
	$: displayedFreq = freq === undefined ? '' : Math.round(freq);
	$: if (osc && freq !== undefined) {
		osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
	}
	const freqMin = 0;
	const freqMax = 25000;
	const calcFreq = (value: number, max: number) => {
		return lerp(freqMin, freqMax, value / max);
	};

	$: volume =
		pointerY >= 0 && $dimensions.height ? calcVolume(pointerY, $dimensions.height) : undefined;
	$: displayedVolume = volume === undefined ? '' : Math.round(volume * 100);
	$: if (gain && volume !== undefined) {
		gain.gain.setTargetAtTime(
			volumeToGain(volume),
			audioCtx.currentTime,
			SMOOTH_GAIN_TIME_CONSTANT,
		);
	}
	const volumeMin = 0;
	const volumeMax = 1;
	const calcVolume = (value: number, max: number) => {
		return lerp(volumeMin, volumeMax, 1 - value / max);
	};

	const start = () => {
		if (osc) return;
		gain = audioCtx.createGain();
		gain.gain.value = 0;
		gain.connect(audioCtx.destination);
		osc = audioCtx.createOscillator();
		osc.type = 'sine';
		osc.start();
		osc.connect(gain);
	};
	const stop = () => {
		if (!osc) return;
		gain!.gain.setTargetAtTime(0, audioCtx.currentTime, SMOOTH_GAIN_TIME_CONSTANT);
		osc.stop(audioCtx.currentTime + SMOOTH_GAIN_TIME_CONSTANT * 2);
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
		pointerX = pointerEventX(e);
		pointerY = pointerEventY(e);
	};
	const handlePointerUp = (e: TouchEvent | MouseEvent) => {
		if (!audioCtx || !osc) return;
		if (!('touches' in e) && e.button !== 0) return; // avoid eating mouse button on Chrome (but not FF?)
		swallow(e); // TODO should these not be called for mobile?
		stop();
	};
	const handlePointerMove = (e: TouchEvent | MouseEvent) => {
		if (!audioCtx || !osc) return;
		swallow(e); // TODO should these not be called for mobile?
		pointerX = pointerEventX(e);
		pointerY = pointerEventY(e);
	};
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
	<div
		class="absolute z-3 w-100 h-100"
		on:mousedown={handlePointerDown}
		on:mouseup={handlePointerUp}
		on:mouseleave={handlePointerUp}
		on:mousemove={handlePointerMove}
		on:touchstart={handlePointerDown}
		on:touchend={handlePointerUp}
		on:touchcancel={handlePointerUp}
		on:touchmove={handlePointerMove}
	/>
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
