<script lang="ts">
	import {run} from 'svelte/legacy';

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
	import {lerp} from '@ryanatkn/belt/maths.js';
	import {clock_context} from '$lib/clock.js';

	import {svelteEasings} from '$lib/easings.js';
	import {volume_to_gain, SMOOTH_GAIN_TIME_CONSTANT} from '$lib/audio_helpers.js';
	import {audio_ctx_context} from '$lib/audio_ctx.js';
	import {midiNames, DEFAULT_TUNING} from '$lib/notes.js';
	import {midiToFreq, type Midi} from '$lib/midi.js';
	import FloatingIconButton from '$lib/FloatingIconButton.svelte';
	import {muted, volume} from '$lib/play_song.js';

	const clock = clock_context.get();

	const easings = svelteEasings;

	let duration = $state(1000);
	let waitTime = $state(250); // time to wait between loops

	let destroyed = false; // TODO is there a better way to do this? `useLoop`?
	onDestroy(() => {
		destroyed = true; // TODO is there a better way to do this? `useLoop`?
		stopAudio();
	});

	let timeNow = 0;
	let timeLast: number;
	let timeTarget: number;
	let tween: number;
	let tweenAlternating: number = $state();
	let xPct: number = $state();
	let yPct: number = $state();
	// TODO refactor `loopState` to a state machine? xstate? microstate?
	// this looks a little more complicated than it needs to be,
	// and the variable names are tattered in spots
	type LoopState = 'waitingLeft' | 'movingRight' | 'waitingRight' | 'movingLeft';
	let loopState: LoopState = 'waitingLeft'; //
	let timePct = 0; // % of the way to `TimeTarget`, when the next state transition will occur
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
		if (isNaN(tween)) console.log(`tween`, tween);
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
	let startNote: Midi = $state((42 + ((Math.random() * 6) | 0)) as Midi); // TODO midi picker
	let endNote: Midi = $state((startNote + 12) as Midi); // TODO midi picker

	// audio playback
	// TODO refactor to share code with `HearingTest` and `PaintFreqs`
	let osc: OscillatorNode | undefined;
	let gain: GainNode | undefined;
	const audio_ctx = audio_ctx_context.get();
	const calcFreq = (pct: number) => lerp(freqMin, freqMax, pct); //|| 0; // TODO getting NaN sometimes here, why?
	const updateAudioization = () => {
		startAudio();

		const freq = calcFreq(tweenAlternating);
		osc!.frequency.setValueAtTime(freq, audio_ctx.currentTime);

		// TODO volume controls
		gain!.gain.setTargetAtTime(
			volume_to_gain(getVolume()),
			audio_ctx.currentTime,
			SMOOTH_GAIN_TIME_CONSTANT,
		);
	};
	const getVolume = (): number => {
		if ($muted) return 0;
		switch (loopState) {
			case 'movingLeft':
			case 'movingRight':
				return $volume;
			case 'waitingLeft':
			case 'waitingRight':
				return $volume;
			default:
				throw Error();
		}
	};
	const startAudio = () => {
		if (audio_ctx.state === 'suspended') {
			// this spams resume, but not spamming resume wasn't working
			void audio_ctx.resume();
		}
		if (osc) return;
		gain = audio_ctx.createGain();
		gain.gain.value = 0;
		gain.connect(audio_ctx.destination);
		osc = audio_ctx.createOscillator();
		osc.type = 'sine';
		osc.start();
		osc.connect(gain);
	};
	const stopAudio = () => {
		if (!osc) return;
		gain!.gain.setTargetAtTime(0, audio_ctx.currentTime, SMOOTH_GAIN_TIME_CONSTANT);
		osc.stop(audio_ctx.currentTime + SMOOTH_GAIN_TIME_CONSTANT);
		osc = undefined;
		gain = undefined;
	};

	let activeEasingIndex = $state(easings.findIndex((e) => e.name === 'elasticOut'));
	let activeEasing = $state(easings[activeEasingIndex]); // {name, fn}

	// transforms
	const graphic1Width = 24;
	const graphic1Height = 24;
	const translate_width = 300;
	const translate_distance = translate_width - graphic1Width;
	const graphic2Width = 96;
	const graphic2Height = 96;

	// chart
	const canvasChartXPadding = 4; // prevents overflow when drawing vertical axis
	const chartCanvasWidth = translate_width + canvasChartXPadding * 2;
	const chartCanvasHeight = 300;
	const chartWidth = chartCanvasWidth - 2 * canvasChartXPadding;
	const canvasChartYPadding = 66; // prevents overflow for easings that spring past their endpoint
	const chartHeight = chartCanvasHeight - 2 * canvasChartYPadding;
	const chartX0 = canvasChartXPadding;
	const chartY0 = chartHeight + canvasChartYPadding;
	let chartCanvas: HTMLCanvasElement = $state(),
		chartCanvasCtx: CanvasRenderingContext2D;
	const chartLineWidth = 3;
	const chartLineHighlightWidth = 12;
	const chartAxisLineWidth = 3;
	const chartGridLineWidth = 1;
	const chartGridSectionCount = 2;
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
		ctx.strokeStyle = get_color(activeEasingIndex);
		ctx.moveTo(chartX0, chartY0 - chartHeight * activeEasing.fn(0));
		for (let i = 1; i <= chartWidth; i++) {
			const pct = activeEasing.fn(i / chartWidth);
			ctx.lineTo(chartX0 + i, chartY0 - chartHeight * pct);
		}
		ctx.stroke();
	};

	const get_color = (index: number, opacity = 0.8) => `hsl(${index * 75}deg 60% 65% / ${opacity})`;
	run(() => {
		if ($clock.running) {
			update($clock.dt);
		} else {
			stopAudio();
		}
	});
	let freqMin = $derived(midiToFreq(startNote, DEFAULT_TUNING));
	run(() => {
		if (isNaN(freqMin)) console.log('freqMin is NaN');
	});
	let freqMax = $derived(midiToFreq(endNote, DEFAULT_TUNING));
	run(() => {
		if (isNaN(freqMax)) console.log('freqMax is NaN');
	});
	run(() => {
		activeEasing = easings[activeEasingIndex];
	});
	run(() => {
		if (chartCanvas && activeEasing) drawChart();
	});
</script>

<div class="box">
	<div class="width_md">
		<section class="visuals_and_controls">
			<section class="active_tween">
				<div class="active_tween_name" style="color: {get_color(activeEasingIndex)};">
					{activeEasing.name}
				</div>
				<div class="chart">
					<div
						class="absolute l-0 t-0"
						style="transform: translate3d({chartX0 +
							xPct * chartWidth -
							chartAxisLineWidth / 2}px, {chartY0 - chartAxisLineWidth / 2}px,
					0); background-color: rgba(255, 255, 255, 0.6); width: {chartAxisLineWidth}px; height: {chartAxisLineWidth}px"
					></div>
					<div
						class="absolute l-0 t-0"
						style="transform: translate3d({chartX0 - chartAxisLineWidth / 2}px, {chartY0 -
							yPct * chartHeight -
							chartAxisLineWidth / 2}px,
					0); background-color: rgba(255, 255, 255, 0.6); width: {chartAxisLineWidth}px; height: {chartAxisLineWidth}px"
					></div>
					<canvas class="relative z-1" bind:this={chartCanvas}></canvas>
					<div
						class="absolute l-0 t-0"
						style="background-color: {get_color(
							activeEasingIndex,
						)}; transform: translate3d({chartX0 +
							xPct * chartWidth -
							chartLineHighlightWidth / 2}px,
					{chartY0 -
							yPct * chartHeight -
							chartLineHighlightWidth / 2}px, 0); width: {chartLineHighlightWidth}px;
					height: {chartLineHighlightWidth}px; border-radius: 50%;"
					></div>
				</div>
				<div
					style="width: {translate_width}px; background-color: {get_color(activeEasingIndex, 0.1)};
				margin-bottom: 24px;"
				>
					<div
						style="transform: translate3d({tweenAlternating *
							translate_distance}px, 0, 0); width: {graphic1Width}px;
					height: {graphic1Height}px; background-color: {get_color(activeEasingIndex)};"
					></div>
				</div>
				<div style="display: flex;">
					<div class="flex items-center justify-center" style="width: {translate_width / 2}px">
						<div
							class="active_tween_graphic_rotate"
							style="transform: rotate({tweenAlternating * 180}deg); height: {graphic2Height}px;
						background-color: {get_color(activeEasingIndex)};"
						></div>
					</div>
					<div class="flex items-center justify-center" style="width: {translate_width / 2}px">
						<div
							class="active_tween_graphic_scale"
							style="transform: scale3d({tweenAlternating}, {tweenAlternating}, 1); width: {graphic2Width}px;
						height: {graphic2Height}px; background-color: {get_color(activeEasingIndex)};"
						></div>
					</div>
				</div>
				<div>
					<div
						class="flex items-center justify-center"
						style="width: {translate_width / 2}px; padding: 36px 36px 0;"
					>
						<div
							style="transform: skew({tweenAlternating * 80 - 25}deg, {tweenAlternating * 10 -
								2}deg);
						width: {graphic2Width}px; height: {graphic2Height}px; background-color: {get_color(
								activeEasingIndex,
							)};"
						></div>
					</div>
				</div>
			</section>

			<section class="controls">
				<div class="controls_group" class:disabled={$muted}>
					<FloatingIconButton label={$muted ? 'unmute' : 'mute'} onclick={() => ($muted = !$muted)}>
						{$muted ? '🔇' : '🔊'}
					</FloatingIconButton>
					<input
						type="range"
						bind:value={$volume}
						min={0}
						max={1}
						step={0.01}
						style="width: 200px;"
						disabled={$muted}
					/>
					<div>{Math.round($volume * 100)}<span>%</span></div>
				</div>
				<label class="controls_group">
					<input type="range" bind:value={startNote} min={lowestNote} max={highestNote} step={1} />
					<div>{midiNames[startNote]}<span style="font-size: 24px;">♪</span></div>
				</label>
				<label class="controls_group">
					<input type="range" bind:value={endNote} min={lowestNote} max={highestNote} step={1} />
					<div>{midiNames[endNote]}<span style="font-size: 24px;">♪</span></div>
				</label>
				<label class="controls_group">
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
				<label class="controls_group">
					<input type="range" bind:value={waitTime} min={0} max={2001} step={1000 / 60} />
					<div>
						<div>{Math.round(waitTime)}<small>ms</small></div>
						<small>waitTime</small>
					</div>
				</label>
			</section>
		</section>

		<section class="tweens">
			{#each easings as easing, i (easing.name)}
				<label
					class="tween_radio"
					class:active={easing === activeEasing}
					style="color: {get_color(i)}; border-color: {easing === activeEasing
						? get_color(i)
						: 'transparent'}"
				>
					<input type="radio" bind:group={activeEasingIndex} value={i} />
					{easing.name}
				</label>
			{/each}
		</section>
	</div>
</div>

<style>
	.controls {
		display: flex;
		flex-direction: column;
		padding-left: var(--space_lg);
		padding-top: 0;
		padding-bottom: 0;
	}
	.controls_group {
		display: flex;
		align-items: center;
		padding: 5px 10px;
	}
	.visuals_and_controls {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
	.active_tween {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: var(--space_xl5);
	}
	.active_tween_graphic_rotate {
		width: 5px;
		transform-origin: middle;
	}
	.active_tween_graphic_scale {
		border-radius: 50%;
		transform-origin: middle;
	}
	.active_tween_name {
		font-size: 48px;
		margin-bottom: 20px;
	}
	.tweens {
		flex-grow: 1;
		flex-basis: 210px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
	}
	.tween_radio {
		display: flex;
		align-items: center;
		font-weight: bold;
		border: var(--border_width_3) var(--clickable_border_style) transparent;
		padding: 10px 15px;
	}
	.tween_radio.active input {
		opacity: 1;
	}
	.chart {
		position: relative;
	}
	section {
		color: rgba(255, 255, 255, 0.8);
		padding: 15px;
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
