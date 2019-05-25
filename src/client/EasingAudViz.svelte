<script>
	/*

	This component takes easing visualizations to an illogical conclusion.
	If we're trying to get a feel for a particular easing function,
	why just use our eyes when we have ears too?

	notes
  - use this in an "easing function picker" (see also freqency picker that uses the piano)
	- consider grouping the easings by type into a vertical block
		(so fooInOut/In/Out are together and easily distinguished as all foo)
	- could be smarter about toggling to the furthest time on toggle/play
	- could try to normalize times when toggled so it doesn't warp time

  */

	import * as easing from 'svelte/easing';
	import {tweened} from 'svelte/motion';
	import {loop} from 'svelte/internal';
	import {onDestroy} from 'svelte';

	import {svelteEasings} from './easings.js';

	const easings = svelteEasings;

	let duration = 1500;
	let waitTime = 250; // time to wait between loops

	let destroyed = false; // TODO is there a better way to do this?
	onDestroy(() => {
		destroyed = true; // TODO is there a better way to do this?
	});

	let timeNow,
		timeLast,
		timeElapsed,
		timeTarget,
		tween,
		tweenAlternating,
		xPct,
		yPct;
	// TODO refactor `loopState` to a state machine? xstate? microstate?
	// this looks a little more complicated than it needs to be,
	// and the variable names are tattered in spots
	let loopState = 'waitingLeft'; // 'waitingLeft' | 'movingRight' | 'waitingRight' | 'movingLeft'
	let timePct = 0; // % of the way to `TimeTarget`, when the next state transition will occur
	let loopPct = 0; // % of the alternating loop
	loop(now => {
		// TODO use clock? somethig like...
		// useClock({timeNow, timeElapsed, timeLast, timeTarget}) // clock state should be a singleton context object
		timeNow = now;
		if (timeTarget === undefined) {
			timeTarget = timeNow + calcTimeTarget(loopState);
		}
		if (timeLast !== undefined) {
			timeElapsed = now - timeLast;
			updateTime();
		}
		timeLast = now;
		return !destroyed;
	});
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
	const getNextLoopState = loopState => {
		return {
			waitingLeft: 'movingRight',
			movingRight: 'waitingRight',
			waitingRight: 'movingLeft',
			movingLeft: 'waitingLeft',
		}[loopState];
	};
	const calcTimeTarget = loopState => {
		return {
			waitingLeft: waitTime,
			movingRight: duration,
			waitingRight: waitTime,
			movingLeft: duration,
		}[loopState];
	};
	const calcTweenPct = (loopState, timePct) => {
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
	const calcXPct = (loopState, timePct) => {
		switch (loopState) {
			case 'movingLeft':
			case 'movingRight':
				return timePct;
			case 'waitingLeft':
			case 'waitingRight':
				return 1;
		}
	};

	let activeEasingIndex = 0;
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
	let chartCanvas, chartCanvasCtx;
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
		if (!chartCanvasCtx) chartCanvasCtx = canvas.getContext('2d');
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

	const getColor = (index, opacity = 0.8) =>
		`hsla(${index * 75}deg, 60%, 65%, ${opacity})`;
</script>

<section class="controls" style="padding-left: 90px;">
	<div class="controls-group">
		<input
			type="range"
			bind:value={duration}
			min={(2 * 1000) / 60}
			max={6000}
			step={1000 / 60} />
		<div style="padding-left: 10px;">
			<div>
				{Math.round(duration)}
				<small>ms</small>
			</div>
			<small>duration</small>
		</div>
	</div>
	<div class="controls-group">
		<input
			type="range"
			bind:value={waitTime}
			min={(2 * 1000) / 60}
			max={2000}
			step={1000 / 60} />
		<div style="padding-left: 10px;">
			<div>
				{Math.round(waitTime)}
				<small>ms</small>
			</div>
			<small>waitTime</small>
		</div>
	</div>
</section>

<section class="active-tween">
	<label
		class="active-tween-name"
		style="color: {getColor(activeEasingIndex)};">
		{activeEasing.name}
	</label>
	<div style="position: relative;">
		<div
			style="position: absolute; left: 0; top: 0; transform: translate3d({chartX0 + xPct * chartWidth - chartAxisLineWidth / 2}px,
			{chartY0 - chartAxisLineWidth / 2}px, 0); background-color: rgba(255, 255,
			255, 0.6); width: {chartAxisLineWidth}px; height: {chartAxisLineWidth}px" />
		<div
			style="position: absolute; left: 0; top: 0; transform: translate3d({chartX0 - chartAxisLineWidth / 2}px,
			{chartY0 - yPct * chartHeight - chartAxisLineWidth / 2}px, 0);
			background-color: rgba(255, 255, 255, 0.6); width: {chartAxisLineWidth}px;
			height: {chartAxisLineWidth}px" />
		<canvas style="position: relative; z-index: 1;" bind:this={chartCanvas} />
		<div
			style="position: absolute; left: 0; top: 0; background-color: {getColor(activeEasingIndex)};
			transform: translate3d({chartX0 + xPct * chartWidth - chartLineHighlightWidth / 2}px,
			{chartY0 - yPct * chartHeight - chartLineHighlightWidth / 2}px, 0); width:
			{chartLineHighlightWidth}px; height: {chartLineHighlightWidth}px;
			border-radius: 50%;" />
	</div>
	<div
		style="width: {translateWidth}px; background-color: {getColor(activeEasingIndex, 0.1)};
		margin-bottom: 24px;">
		<div
			class="active-tween-graphic-translate"
			style="transform: translate3d({tweenAlternating * translateDistance}px, 0,
			0); width: {graphic1Width}px; height: {graphic1Height}px;
			background-color: {getColor(activeEasingIndex)};" />
	</div>
	<div style="display: flex;">
		<div
			style="display: flex; align-items: center; justify-content: center; width:
			{translateWidth / 2}px">
			<div
				class="active-tween-graphic-rotate"
				style="transform: rotate({tweenAlternating * 180}deg); height: {graphic2Height}px;
				background-color: {getColor(activeEasingIndex)};" />
		</div>
		<div
			style="display: flex; align-items: center; justify-content: center; width:
			{translateWidth / 2}px">
			<div
				class="active-tween-graphic-scale"
				style="transform: scale3d({tweenAlternating}, {tweenAlternating}, 1);
				width: {graphic2Width}px; height: {graphic2Height}px; background-color: {getColor(activeEasingIndex)};" />
		</div>
	</div>
</section>

<section class="tweens">
	{#each easings as easing, i (easing.name)}
		<label
			class="tween-radio"
			class:active={easing === activeEasing}
			style="color: {getColor(i)}; border-color: {easing === activeEasing ? getColor(i) : 'transparent'}">
			<input type="radio" bind:group={activeEasingIndex} value={i} />
			{easing.name}
		</label>
	{/each}
</section>

<style>
	.controls {
		display: flex;
		flex-direction: column;
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
	/*.active-tween-graphic-translate {}*/
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
	}
	.tween-radio {
		display: flex;
		align-items: center;
		font-weight: bold;
		border: 3px dashed transparent;
		padding: 10px 15px;
	}
	.tween-radio.active input {
		opacity: 1;
	}
	section {
		color: rgba(255, 255, 255, 0.8);
		padding: 15px;
		max-width: 980px;
		margin: 0 auto;
	}
	input[type='range'] {
		width: 300px;
	}
	input[type='radio'] {
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
	button {
		height: 40px;
	}
</style>
