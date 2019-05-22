<script>
	import {spring} from 'svelte/motion';

	import {createAudioCtx} from '../audio/audioCtx.js';
	import {mix} from '../utils/math.js';
	import {volumeToGain, SMOOTH_GAIN_TIME_CONSTANT} from '../audio/utils.js';

	let width;
	let height;

	let audioCtx;
	const initAudioCtx = () => {
		audioCtx = createAudioCtx();
	};

	let pointerX = -300;
	let pointerY = -300;

	let spotPosition = spring(
		{x: pointerX, y: pointerY},
		{
			stiffness: 0.08,
			damping: 0.32,
		},
	);
	$: spotPosition.set({x: pointerX, y: pointerY});

	let osc;
	let gain;

	$: freq = pointerX >= 0 && width ? calcFreq(pointerX, width) : undefined;
	$: displayedFreq = freq === undefined ? '' : Math.round(freq);
	$: if (osc && freq !== undefined) {
		osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
	}
	const freqMin = 0;
	const freqMax = 25000;
	const calcFreq = (value, max) => {
		return mix(freqMin, freqMax, value / max);
	};

	$: volume =
		pointerY >= 0 && height ? calcVolume(pointerY, height) : undefined;
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
	const calcVolume = (value, max) => {
		return mix(volumeMin, volumeMax, 1 - value / max);
	};

	const start = () => {
		if (osc) return;
		if (!audioCtx) initAudioCtx();
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
		gain.gain.setTargetAtTime(
			0,
			audioCtx.currentTime,
			SMOOTH_GAIN_TIME_CONSTANT,
		);
		osc.stop(audioCtx.currentTime + SMOOTH_GAIN_TIME_CONSTANT * 2);
		osc = undefined;
		gain = undefined;
	};

	// TODO more cleanly handle touch/click - pointer events with polyfill for Safari? (probably using Svelte actions)
	// or maybe support multiple touches? yeah...that makes sense here.
	const pointerEventX = e =>
		e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
	const pointerEventY = e =>
		e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
	const handlePointerDown = e => {
		start();
		pointerX = pointerEventX(e);
		pointerY = pointerEventY(e);
	};
	const handlePointerUp = e => {
		if (!audioCtx || !osc) return;
		stop();
	};
	const handlePointerMove = e => {
		if (!audioCtx || !osc) return;
		pointerX = pointerEventX(e);
		pointerY = pointerEventY(e);
	};
</script>

<div class="wrapper">
	{#if $spotPosition}
		<svg>
			<filter id="blurOuter" height="200%" width="200%" y="-50%" x="-50%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="10" />
			</filter>
			<circle
				class="outer"
				cx={$spotPosition.x}
				cy={$spotPosition.y}
				r={20}
				filter="url(#blurOuter)" />
			<circle class="inner" cx={$spotPosition.x} cy={$spotPosition.y} r={2} />
		</svg>
	{/if}
	{#if volume !== undefined}
		<div class="volume">
			<div>
				{displayedVolume}
				<span class="unit">%</span>
			</div>
		</div>
	{/if}
	{#if freq !== undefined}
		<div class="freq">
			<div>
				{displayedFreq}
				<span class="unit">hz</span>
			</div>
		</div>
	{/if}
	<div
		class="surface"
		on:mousedown|stopPropagation|preventDefault={handlePointerDown}
		on:mouseup|stopPropagation|preventDefault={handlePointerUp}
		on:mouseleave|stopPropagation|preventDefault={handlePointerUp}
		on:mousemove|stopPropagation|preventDefault={handlePointerMove}
		on:touchstart|stopPropagation|preventDefault={handlePointerDown}
		on:touchend|stopPropagation|preventDefault={handlePointerUp}
		on:touchcancel|stopPropagation|preventDefault={handlePointerUp}
		on:touchmove|stopPropagation|preventDefault={handlePointerMove}
		bind:clientWidth={width}
		bind:clientHeight={height} />
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
	.surface {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 3;
	}
	svg {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
	}
	circle.outer {
		fill: rgba(226, 182, 255, 0.4);
	}
	circle.inner {
		fill: rgb(226, 182, 255);
	}
	.volume {
		position: absolute;
		left: 20px;
		top: 0;
		z-index: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		font-size: 50px;
		color: #fff;
	}
	.freq {
		position: absolute;
		bottom: 15px;
		left: 0;
		z-index: 1;
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		font-size: 50px;
		color: #fff;
	}
	.unit {
		opacity: 0.6;
	}
</style>
