<script lang="ts">
	/*
	
	WARNING: messy code
	TODO refactor
	
	This component hopes to give us insight into the behavior of easing functions
	by both visualizing and *audioizing* them.
	If we're trying to get a feel for a particular easing function,
	why just use our eyes when we have ears too?
	Be forewarned: the sounds may annoy you and your neighbors.
	
	notes
	- could add a midi picker for the start/end notes
	- could add a piano visualization (toggleable)
	- could improve the volume controls (make a reusable component)
  - use this in an "easing function picker" (see also freqency picker that uses the piano)
	- consider grouping the easings by type into a vertical block
	(so fooInOut/In/Out are together and easily distinguished as all foo)
	- could be smarter about toggling to the furthest time on toggle/play
	- could try to normalize times when toggled so it doesn't warp time
	
  */

	import {onDestroy} from 'svelte';
	import {lerp} from '@feltcoop/felt/util/maths.js';

	import {svelteEasings} from '$lib/app/easings';
	import {volumeToGain, SMOOTH_GAIN_TIME_CONSTANT} from '$lib/audio/utils';
	import {getAudioCtx} from '$lib/audio/audioCtx';
	import {midiNames} from '$lib/music/notes';
	import {midiToFreq, type Midi} from '$lib/music/midi';
	import {DEFAULT_TUNING} from '$lib/music/constants';
	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import {getClock} from '$lib/app/clock';

	const clock = getClock();

	const easings = svelteEasings;

	let duration = 1000;
	let waitTime = 250; // time to wait between loops

	let destroyed = false; // TODO is there a better way to do this? `useLoop`?
	onDestroy(() => {
		destroyed = true; // TODO is there a better way to do this? `useLoop`?
		stopAudio();
	});

	let timeNow = 0;
	let timeLast: number;
	let timeTarget: number;
	let tween: number;
	let tweenAlternating: number;
	let xPct: number;
	let yPct: number;
	// TODO refactor `loopState` to a state machine? xstate? microstate?
	// this looks a little more complicated than it needs to be,
	// and the variable names are tattered in spots
	type LoopState = 'waitingLeft' | 'movingRight' | 'waitingRight' | 'movingLeft';
	let loopState: LoopState = 'waitingLeft'; //
	let timePct = 0; // % of the way to `TimeTarget`, when the next state transition will occur
	$: if ($clock.running) {
		update($clock.dt);
	} else {
		stopAudio();
	}
	const update = (dt: number) => {
		timeLast = timeNow;
		timeNow += dt;
		if (timeTarget === undefined) {
			timeTarget = timeNow + calcTimeTarget(loopState);
		}
		if (timeLast !== 0) {
			updateTime();
			updateAudioization();
		}
		return !destroyed;
	};
	const updateTime = () => {
		if (timeNow >= timeTarget) {
			loopState = getNextLoopState(loopState);
			timeTarget = timeNow + calcTimeTarget(loopState);
		}
		const timeToTarget = timeTarget - timeNow;
		timePct = 1 - timeToTarget / duration;
		xPct = calcXPct(loopState, timePct);
		yPct = activeEasing.fn(xPct);
		tween = activeEasing.fn(calcTweenPct(loopState, timePct));
		tweenAlternating = loopState === 'movingLeft' ? 1 - tween : tween;
	};
	const getNextLoopState = (loopState: LoopState): LoopState => {
		return {
			waitingLeft: 'movingRight',
			movingRight: 'waitingRight',
			waitingRight: 'movingLeft',
			movingLeft: 'waitingLeft',
		}[loopState] as LoopState;
	};
	const calcTimeTarget = (loopState: LoopState) => {
		return {
			waitingLeft: waitTime,
			movingRight: duration,
			waitingRight: waitTime,
			movingLeft: duration,
		}[loopState];
	};
	const calcTweenPct = (loopState: LoopState, timePct: number) => {
		switch (loopState) {
			case 'movingRight':
			case 'movingLeft':
				return timePct;
			case 'waitingLeft':
				return 0;
			case 'waitingRight':
				return 1;
		}
	};
	const calcXPct = (loopState: LoopState, timePct: number) => {
		switch (loopState) {
			case 'movingLeft':
			case 'movingRight':
				return timePct;
			case 'waitingLeft':
			case 'waitingRight':
				return 1;
		}
	};

	// audio options
	const lowestNote = 21;
	const highestNote = 108;
	let startNote: Midi = (42 + ((Math.random() * 6) | 0)) as Midi; // TODO midi picker
	let endNote: Midi = (startNote + 12) as Midi; // TODO midi picker

	// audio playback
	// TODO refactor to share code with `HearingTest` and `PaintFreqs`
	let osc: OscillatorNode | undefined;
	let gain: GainNode | undefined;
	const audioCtx = getAudioCtx();
	let volume = 0.5;
	let muted = false;
	$: freqMin = midiToFreq(startNote, DEFAULT_TUNING);
	$: freqMax = midiToFreq(endNote, DEFAULT_TUNING);
	const calcFreq = (pct: number) => lerp(freqMin, freqMax, pct);
	const updateAudioization = () => {
		startAudio();

		const freq = calcFreq(tweenAlternating);
		osc!.frequency.setValueAtTime(freq, audioCtx.currentTime);

		// TODO volume controls
		gain!.gain.setTargetAtTime(
			volumeToGain(getVolume()),
			audioCtx.currentTime,
			SMOOTH_GAIN_TIME_CONSTANT,
		);
	};
	const getVolume = (): number => {
		if (muted) return 0;
		switch (loopState) {
			case 'movingLeft':
			case 'movingRight':
				return volume;
			case 'waitingLeft':
			case 'waitingRight':
				return volume;
			default:
				throw Error();
		}
	};
	const startAudio = () => {
		if (osc) return;
		gain = audioCtx.createGain();
		gain.gain.value = 0;
		gain.connect(audioCtx.destination);
		osc = audioCtx.createOscillator();
		osc.type = 'sine';
		osc.start();
		osc.connect(gain);
	};
	const stopAudio = () => {
		if (!osc) return;
		gain!.gain.setTargetAtTime(0, audioCtx.currentTime, SMOOTH_GAIN_TIME_CONSTANT);
		osc.stop(audioCtx.currentTime + SMOOTH_GAIN_TIME_CONSTANT);
		osc = undefined;
		gain = undefined;
	};

	let activeEasingIndex = easings.findIndex((e) => e.name === 'elasticOut');
	let activeEasing = easings[activeEasingIndex]; // {name, fn}
	$: activeEasing = easings[activeEasingIndex];

	// transforms
	const graphic1Width = 24;
	const graphic1Height = 24;
	const translateWidth = 300;
	const translateDistance = translateWidth - graphic1Width;
	const graphic2Width = 96;
	const graphic2Height = 96;

	// chart
	const canvasChartXPadding = 4; // prevents overflow when drawing vertical axis
	const chartCanvasWidth = translateWidth + canvasChartXPadding * 2;
	const chartCanvasHeight = 300;
	const chartWidth = chartCanvasWidth - 2 * canvasChartXPadding;
	const canvasChartYPadding = 66; // prevents overflow for easings that spring past their endpoint
	const chartHeight = chartCanvasHeight - 2 * canvasChartYPadding;
	const chartX0 = canvasChartXPadding;
	const chartY0 = chartHeight + canvasChartYPadding;
	let chartCanvas: HTMLCanvasElement, chartCanvasCtx: CanvasRenderingContext2D;
	const chartLineWidth = 3;
	const chartLineHighlightWidth = 12;
	const chartAxisLineWidth = 3;
	const chartGridLineWidth = 1;
	const chartGridSectionCount = 2;
	$: if (chartCanvas && activeEasing) drawChart();
	const drawChart = () => {
		// TODO could probably abstract this better - maybe an action? maybe multiple or parameterized for different canvas use cases?
		const canvas = chartCanvas;
		const width = chartCanvasWidth;
		const height = chartCanvasHeight;
		if (canvas.width !== width) canvas.width = width;
		if (canvas.height !== height) canvas.height = height;
		if (!chartCanvasCtx) chartCanvasCtx = canvas.getContext('2d')!;
		const ctx = chartCanvasCtx;
		ctx.clearRect(0, 0, width, height);

		// draw the chart axes
		ctx.beginPath();
		ctx.lineWidth = chartAxisLineWidth;
		ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
		ctx.moveTo(chartX0, chartY0 - chartHeight);
		ctx.lineTo(chartX0, chartY0);
		ctx.lineTo(chartX0 + chartWidth, chartY0);
		ctx.stroke();

		// draw the chart grid
		ctx.beginPath();
		ctx.lineWidth = chartGridLineWidth;
		ctx.strokeStyle = `rgba(80, 80, 80, 0.3)`;
		for (let i = 1; i <= chartGridSectionCount; i++) {
			const y = chartY0 - (i * chartHeight) / chartGridSectionCount;
			ctx.moveTo(chartX0 + chartWidth, y);
			ctx.lineTo(chartX0, y);
			ctx.stroke();
		}

		// draw the active easing
		ctx.beginPath();
		ctx.lineWidth = chartLineWidth;
		ctx.strokeStyle = getColor(activeEasingIndex);
		ctx.moveTo(chartX0, chartY0 - chartHeight * activeEasing.fn(0));
		for (let i = 1; i <= chartWidth; i++) {
			const pct = activeEasing.fn(i / chartWidth);
			ctx.lineTo(chartX0 + i, chartY0 - chartHeight * pct);
		}
		ctx.stroke();
	};

	const getColor = (index: number, opacity = 0.8) => `hsla(${index * 75}deg, 60%, 65%, ${opacity})`;
</script>

<div class="easing-aud-viz">
	<section>
		<section class="controls">
			<div class="controls-group {muted ? 'disabled' : ''}">
				<FloatingIconButton label={muted ? 'unmute' : 'mute'} on:click={() => (muted = !muted)}>
					{muted ? '🔇' : '🔊'}
				</FloatingIconButton>
				<input
					type="range"
					bind:value={volume}
					min={0}
					max={1}
					step={0.01}
					style="width: 200px;"
					disabled={muted}
				/>
				<div>{Math.round(volume * 100)}<span>%</span></div>
			</div>
			<label class="controls-group">
				<input type="range" bind:value={startNote} min={lowestNote} max={highestNote} step={1} />
				<div>{midiNames[startNote]}<span style="font-size: 24px;">♪</span></div>
			</label>
			<label class="controls-group">
				<input type="range" bind:value={endNote} min={lowestNote} max={highestNote} step={1} />
				<div>{midiNames[endNote]}<span style="font-size: 24px;">♪</span></div>
			</label>
			<label class="controls-group">
				<input
					type="range"
					bind:value={duration}
					min={(2 * 1000) / 60}
					max={6000}
					step={1000 / 60}
				/>
				<div>
					<div>{Math.round(duration)}<small>ms</small></div>
					<small>duration</small>
				</div>
			</label>
			<label class="controls-group">
				<input type="range" bind:value={waitTime} min={0} max={2001} step={1000 / 60} />
				<div>
					<div>{Math.round(waitTime)}<small>ms</small></div>
					<small>waitTime</small>
				</div>
			</label>
		</section>

		<section class="active-tween">
			<div class="active-tween-name" style="color: {getColor(activeEasingIndex)};">
				{activeEasing.name}
			</div>
			<div class="chart">
				<div
					class="absolute l-0 t-0"
					style="transform: translate3d({chartX0 +
						xPct * chartWidth -
						chartAxisLineWidth / 2}px, {chartY0 - chartAxisLineWidth / 2}px,
					0); background-color: rgba(255, 255, 255, 0.6); width: {chartAxisLineWidth}px; height: {chartAxisLineWidth}px"
				/>
				<div
					class="absolute l-0 t-0"
					style="transform: translate3d({chartX0 - chartAxisLineWidth / 2}px, {chartY0 -
						yPct * chartHeight -
						chartAxisLineWidth / 2}px,
					0); background-color: rgba(255, 255, 255, 0.6); width: {chartAxisLineWidth}px; height: {chartAxisLineWidth}px"
				/>
				<canvas class="relative z-1" bind:this={chartCanvas} />
				<div
					class="absolute l-0 t-0"
					style="background-color: {getColor(activeEasingIndex)}; transform: translate3d({chartX0 +
						xPct * chartWidth -
						chartLineHighlightWidth / 2}px,
					{chartY0 -
						yPct * chartHeight -
						chartLineHighlightWidth / 2}px, 0); width: {chartLineHighlightWidth}px;
					height: {chartLineHighlightWidth}px; border-radius: 50%;"
				/>
			</div>
			<div
				style="width: {translateWidth}px; background-color: {getColor(activeEasingIndex, 0.1)};
				margin-bottom: 24px;"
			>
				<div
					style="transform: translate3d({tweenAlternating *
						translateDistance}px, 0, 0); width: {graphic1Width}px;
					height: {graphic1Height}px; background-color: {getColor(activeEasingIndex)};"
				/>
			</div>
			<div style="display: flex;">
				<div class="flex items-center justify-center" style="width: {translateWidth / 2}px">
					<div
						class="active-tween-graphic-rotate"
						style="transform: rotate({tweenAlternating * 180}deg); height: {graphic2Height}px;
						background-color: {getColor(activeEasingIndex)};"
					/>
				</div>
				<div class="flex items-center justify-center" style="width: {translateWidth / 2}px">
					<div
						class="active-tween-graphic-scale"
						style="transform: scale3d({tweenAlternating}, {tweenAlternating}, 1); width: {graphic2Width}px;
						height: {graphic2Height}px; background-color: {getColor(activeEasingIndex)};"
					/>
				</div>
			</div>
			<div>
				<div
					class="flex items-center justify-center"
					style="width: {translateWidth / 2}px; padding: 36px 36px 0;"
				>
					<div
						style="transform: skew({tweenAlternating * 80 - 25}deg, {tweenAlternating * 10 - 2}deg);
						width: {graphic2Width}px; height: {graphic2Height}px; background-color: {getColor(
							activeEasingIndex,
						)};"
					/>
				</div>
			</div>
		</section>
	</section>

	<section class="tweens">
		{#each easings as easing, i (easing.name)}
			<label
				class="tween-radio"
				class:active={easing === activeEasing}
				style="color: {getColor(i)}; border-color: {easing === activeEasing
					? getColor(i)
					: 'transparent'}"
			>
				<input type="radio" bind:group={activeEasingIndex} value={i} />
				{easing.name}
			</label>
		{/each}
	</section>
</div>

<style>
	.easing-aud-viz {
		max-width: 1337px;
		display: flex;
		flex-wrap: wrap;
		margin: auto;
	}
	.controls {
		display: flex;
		flex-direction: column;
		padding-left: 90px;
	}
	.controls-group {
		display: flex;
		align-items: center;
		padding: 5px 10px;
	}
	.active-tween {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 6px;
	}
	.active-tween-graphic-rotate {
		width: 5px;
		transform-origin: middle;
	}
	.active-tween-graphic-scale {
		border-radius: 50%;
		transform-origin: middle;
	}
	.active-tween-name {
		font-size: 48px;
		margin-bottom: 20px;
	}
	.tweens {
		display: flex;
		flex-wrap: wrap;
		flex-grow: 1;
		flex-basis: 440px;
	}
	.tween-radio {
		display: flex;
		align-items: center;
		font-weight: bold;
		border: var(--border_width_3) var(--clickable_border_style) transparent;
		padding: 10px 15px;
	}
	.tween-radio.active input {
		opacity: 1;
	}
	.chart {
		position: relative;
	}
	section {
		color: rgba(255, 255, 255, 0.8);
		padding: 15px;
		margin: 0 auto;
	}
	input[type='range'] {
		margin: 0 10px;
		width: 300px;
	}
	/* TODO upstream and figure out custom appearance */
	input[type='radio'] {
		--input_width_min: var(--input_height);
		width: var(--input_height);
		appearance: auto;
		padding: 0;
		margin: 0 5px 0 0;
		opacity: 0.4;
	}
	input[type='radio']:hover {
		opacity: 0.6;
	}
	input[type='radio']:active {
		opacity: 1;
	}
	.disabled {
		opacity: 0.6;
	}
</style>
