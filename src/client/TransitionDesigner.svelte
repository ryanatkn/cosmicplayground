<script context="module">
	let rotateMax = 2;
	let rotateMin = -2;
	let rotateStep = 0.01;
</script>

<script>
	import {onMount, onDestroy} from 'svelte';
	import {fade} from 'svelte/transition';
	import {mix} from '../utils/math.js';

	//  possible improvements
	//  - control the time indicator (it's read-only atm)
	//  - persist props when unmounted
	//  - customize the image (and arbitrary markup)
	//  - 3d rotation handles directly on the in/out states (it's very awkward to use right now)
	//  - support more transforms and css properties than just rotate3d
	//  - fix the bad states it temporarily enters when some values like duration are changed
	//  - better input controls (functionality and aesthetics)
	//    - number inputs for the rotation values
	//    - range or other input type for duration values
	//  - is there a way to cache the css transition animations so they're not recomputed every time?
	//  - tweens and springs

	export let imgSrc = 'assets/construction/person-rock.gif';

	let visible = true;
	let durationIn = 1000;
	let durationOut = 2000;
	let timeout;

	const queueTimeout = (time = visible ? durationIn : durationOut) => {
		if (timeout) return;
		timeout = setTimeout(() => {
			visible = !visible;
			timeout = undefined;
			queueTimeout();
		}, time);
	};

	onMount(() => {
		queueTimeout(0);
	});
	onDestroy(() => {
		clearTimeout(timeout);
	});

	const resetTimeout = () => {
		clearTimeout(timeout);
		timeout = undefined;
	};

	const transition = (node, {delay = 0, duration = 1000}) => {
		return {
			delay,
			duration,
			css: (t, u) =>
				`transform: ${computeRotation(
					t,
					rotate3dX1,
					rotate3dX2,
					rotate3dY1,
					rotate3dY2,
					rotate3dZ1,
					rotate3dZ2,
					rotate3dDeg1,
					rotate3dDeg2,
				)};`,
		};
	};

	const computeRotation = (t, x1, x2, y1, y2, z1, z2, deg1, deg2) => {
		return `rotate3d(${mix(x1, x2, t)}, ${mix(y1, y2, t)}, ${mix(
			z1,
			z2,
			t,
		)}, ${mix(deg1, deg2, t)}deg)`;
	};

	const timeSliderWidth = 300;
	const timeSliderBorderWidth = 3;
	const timeIndicatorSize = 20;
	const timeTransition = (node, {delay = 0, duration = 1000}) => {
		return {
			delay,
			duration,
			css: (t, u) =>
				`transform: translate3d(${(timeSliderWidth - timeIndicatorSize) *
					t}px, 0, 0);`,
		};
	};

	let rotate3dX1 = 0.65;
	let rotate3dY1 = 0.06;
	let rotate3dZ1 = -0.07;
	let rotate3dDeg1 = 40;
	$: rotate3d1 = `rotate3d(${rotate3dX1}, ${rotate3dY1}, ${rotate3dZ1}, ${rotate3dDeg1}deg)`;

	let rotate3dX2 = -0.5;
	let rotate3dY2 = 0.5;
	let rotate3dZ2 = 0.19;
	let rotate3dDeg2 = 27;
	$: rotate3d2 = `rotate3d(${rotate3dX2}, ${rotate3dY2}, ${rotate3dZ2}, ${rotate3dDeg2}deg)`;
</script>

<section
	style="height: 100px; display: flex; align-items: center; justify-content:
	center;">
	<img
		src={imgSrc}
		alt="styler target"
		style="width: 162px; height: 100px; transform: {rotate3d1}; margin-right:
		50px;"
		class="pixelated" />
	<img
		src={imgSrc}
		alt="styler target"
		style="width: 162px; height: 100px; transform: {rotate3d2}"
		class="pixelated" />
</section>
<section
	style="height: 200px; display: flex; align-items: center; justify-content:
	center;">
	<div style="display: inline-block; width: 162px; height: 100px;">
		{#if visible}
			<img
				in:transition={{duration: durationIn}}
				out:transition={{duration: durationOut}}
				src={imgSrc}
				alt="styler target"
				style="width: 162px; height: 100px;"
				class="pixelated" />
		{/if}
	</div>
</section>

<section class="controls">
	{#if visible}
		<div
			class="time"
			style="width: {timeSliderWidth}px; height: {timeIndicatorSize + timeSliderBorderWidth * 2}px;
			border-width: {timeSliderBorderWidth}px; border-radius: {(timeIndicatorSize + timeSliderBorderWidth * 2) / 2}px;">
			<div
				class="time-indicator"
				style="width: {timeIndicatorSize}px; height: {timeIndicatorSize}px;"
				in:timeTransition={{duration: durationIn}}
				out:timeTransition={{duration: durationOut}} />
		</div>
	{/if}
</section>

<section class="controls">
	<section>
		<label>
			<input type="number" bind:value={durationIn} />
			<small>duration in</small>
		</label>
		<label>
			<input type="number" bind:value={durationOut} />
			<small>duration out</small>
		</label>
	</section>

	<section>
		<pre>{rotate3d1}</pre>
		<label>
			<input
				type="range"
				bind:value={rotate3dX1}
				min={rotateMin}
				max={rotateMax}
				step={rotateStep} />
			{rotate3dX1}
			<small>x1</small>
		</label>
		<label>
			<input
				type="range"
				bind:value={rotate3dY1}
				min={rotateMin}
				max={rotateMax}
				step={rotateStep} />
			{rotate3dY1}
			<small>y1</small>
		</label>
		<label>
			<input
				type="range"
				bind:value={rotate3dZ1}
				min={rotateMin}
				max={rotateMax}
				step={rotateStep} />
			{rotate3dZ1}
			<small>z1</small>
		</label>
		<label>
			<input
				type="range"
				bind:value={rotate3dDeg1}
				min={-360}
				max={360}
				step={1} />
			{rotate3dDeg1}
			<small>deg1</small>
		</label>
	</section>

	<section>
		<pre>{rotate3d2}</pre>
		<label>
			<input
				type="range"
				bind:value={rotate3dX2}
				min={rotateMin}
				max={rotateMax}
				step={rotateStep} />
			{rotate3dX2}
			<small>x2</small>
		</label>
		<label>
			<input
				type="range"
				bind:value={rotate3dY2}
				min={rotateMin}
				max={rotateMax}
				step={rotateStep} />
			{rotate3dY2}
			<small>y2</small>
		</label>
		<label>
			<input
				type="range"
				bind:value={rotate3dZ2}
				min={rotateMin}
				max={rotateMax}
				step={rotateStep} />
			{rotate3dZ2}
			<small>z2</small>
		</label>
		<label>
			<input
				type="range"
				bind:value={rotate3dDeg2}
				min={-360}
				max={360}
				step={1} />
			{rotate3dDeg2}
			<small>deg2</small>
		</label>
	</section>

</section>

<style>
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center;
	}
	.controls > section {
		padding: 10px;
	}
	section {
		margin-top: 10px;
		color: rgba(255, 255, 255, 0.8);
	}
	input[type='number'] {
		width: 100px;
	}
	input[type='range'] {
		width: 300px;
	}
	label {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.time {
		position: relative;
		border-style: dotted;
		border-color: rgba(255, 215, 235, 0.32);
	}
	.time-indicator {
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 50%;
		background-color: rgba(255, 215, 235, 0.6);
	}
</style>
