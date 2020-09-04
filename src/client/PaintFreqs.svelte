<script>
	import {spring} from 'svelte/motion';
	import {onMount, onDestroy} from 'svelte';

	import {useAudioCtx} from '../audio/audioCtx.js';
	import {mix} from '../utils/math.js';
	import {volumeToGain, SMOOTH_GAIN_TIME_CONSTANT} from '../audio/utils.js';
	import {hslToRgb} from '../utils/colors.js';
	import {freqToMidi} from '../music/midi.js';
	import {DEFAULT_TUNING} from '../music/constants.js';

	/*

  ideas
   - holding shift/alt should follow spectrum, not cardinal vectors
	- add button to lock pointer down
	  - visualize pointer down
	- investigate the perf issues
	- possibly make a different verison that disallows lifting the pointer (or add a toggle)
  - support painting with a closed shape, not just lines
		- negative space?
	- volume controls
  - are there other interesting ways to convey octave differences?
  - interval bands? maybe separate button half into chunky intervals
	- blended colors instead of nearest chroma?
  - trail history
    - bug - lines will change freq after page resize
    - repeat/move
  - keyboard shortcuts
	- replay
		- hold a key to play in reverse
  - multi touch
  - share (lines in hash)

  */

	let pointerX = -300;
	let pointerY = -300;
	let width, height;
	let canvas, canvasCtx, canvasData, fgDataUrl;
	$: if (canvas && width && height) updateCanvas();

	// TODO move to shared location? src/music/notes? colors?
	const colorsByChroma = Array.from({length: 12}, (_, i) => hslToRgb(i / 12, 0.3, 0.5));

	// could debounce this if it's too slow on resize
	const updateCanvas = () => {
		if (canvasData && canvasData.width === width && canvasData.height === height) {
			return;
		}
		if (canvas.width !== width) canvas.width = width;
		if (canvas.height !== height) canvas.height = height;
		if (!canvasCtx) canvasCtx = canvas.getContext('2d'); // TODO is it possible this gets stale? I don't think so under current usage - but what if the canvas changes in the future?
		canvasCtx.clearRect(0, 0, width, height);
		canvasData = canvasCtx.createImageData(width, height);
		drawFreqColors();
	};
	const drawFreqColors = () => {
		const {data} = canvasData;
		for (let i = 0; i < data.length; i += 4) {
			const n = i / 4;
			const x = n % width;
			const y = Math.floor(n / width);
			const freq = calcFreq(x, y, width, height);
			const chroma = freqToMidi(freq, DEFAULT_TUNING) % 12;
			const [r, g, b, a] = colorsByChroma[chroma];
			data[i] = r;
			data[i + 1] = g;
			data[i + 2] = b;
			data[i + 3] = 255;
		}
		canvasCtx.putImageData(canvasData, 0, 0);
		fgDataUrl = canvas.toDataURL();
	};

	let lines = [{id: 0, points: ''}];
	const createNextPoint = () => ({
		id: lines[lines.length - 1].id + 1,
		points: '',
	});
	// this won't work for replaying sounds - we'd need to store lines every frame instead of pointer changes
	$: if (pointerX >= 0) addPoint(pointerX, pointerY);
	const addPoint = (x, y) => {
		const point = ` ${x},${y}`;
		const line = lines[lines.length - 1];
		if (line.points) {
			line.points += point;
		} else {
			// draw the initial point as a tiny line, so individual points appear onscreen
			line.points = `${x - 3},${y - 3}${point}`;
		}
		lines = lines.slice();
	};

	const audioCtx = useAudioCtx();

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

	const VOLUME = 0.35; // TODO probably hook into global settings

	$: freq = width ? calcFreq(pointerX, pointerY, width, height) : undefined;
	$: if (osc && freq !== undefined) osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
	$: displayedFreq = freq === undefined ? '' : Math.round(freq);

	const start = () => {
		if (osc) return;
		gain = audioCtx.createGain();
		gain.gain.value = 0;
		gain.gain.setTargetAtTime(
			volumeToGain(VOLUME),
			audioCtx.currentTime,
			SMOOTH_GAIN_TIME_CONSTANT,
		);
		gain.connect(audioCtx.destination);
		osc = audioCtx.createOscillator();
		osc.type = 'sine';
		osc.start();
		osc.connect(gain);
	};
	const stop = () => {
		if (!osc) return;
		gain.gain.setTargetAtTime(0, audioCtx.currentTime, SMOOTH_GAIN_TIME_CONSTANT);
		osc.stop(audioCtx.currentTime + SMOOTH_GAIN_TIME_CONSTANT * 2);
		osc = undefined;
		gain = undefined;
	};

	onDestroy(stop);

	const freqMin = 20; // freq is this when x=0
	const freqMax = 6000; // freq is this when x=width
	const yMultMin = 0.5; // freq is multiplied by this value when y=height
	const yMultMax = 1.5; // freq is multiplied by this value when y=0
	const calcFreq = (x, y, w, h) => {
		const yPct = 1 - y / h;
		// get roughly equal frequency bands on the X axis - dunno what the exact math is
		const xPct = Math.pow(x / 2 / w + 0.5, 10);
		return mix(freqMin, freqMax, xPct) * mix(yMultMin, yMultMax, yPct);
	};

	// TODO more cleanly handle touch/click - pointer events with polyfill for Safari? (probably using Svelte actions)
	// or maybe support multiple touches? yeah...that makes sense here.
	const pointerEventX = (e) => (e.touches && e.touches.length ? e.touches[0].clientX : e.clientX);
	const pointerEventY = (e) => (e.touches && e.touches.length ? e.touches[0].clientY : e.clientY);
	const handlePointerDown = (e) => {
		start();
		pointerX = pointerEventX(e);
		pointerY = pointerEventY(e);

		const nextPoint = createNextPoint();
		lines.push(nextPoint);
		lines = lines.slice();
	};
	const handlePointerUp = (e) => {
		if (!audioCtx || !osc) return;
		stop();
	};
	const handlePointerMove = (e) => {
		if (!audioCtx || !osc) return;
		if (!e.altKey) pointerX = pointerEventX(e);
		if (!e.shiftKey) pointerY = pointerEventY(e);
	};

	// controls
	const clear = () => {
		lines = [createNextPoint()];
	};
</script>

<div class="relative w-100 h-100 overflow-hidden">
	{#if $spotPosition}
		<svg class="absolute0 z-2 w-100 h-100">
			<!--
				Chrome doesn't appear to support setting a canvas mask to an svg (it works in Firefox)
				so we use an svg `image` with a `dataUrl` instead.
			-->
			<image xlink:href={fgDataUrl} {width} {height} mask="url(#linePaths)" />
			<defs>
				<mask id="linePaths">
					{#each lines as line (line.id)}
						<polyline points={line.points} stroke="white" stroke-width="5" fill="none" />
					{/each}
				</mask>
			</defs>

			<filter id="blurOuter" height="300%" width="300%" y="-50%" x="-50%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="15" />
			</filter>
			<circle
				class="outer"
				cx={$spotPosition.x}
				cy={$spotPosition.y}
				r={30}
				filter="url(#blurOuter)"
			/>
			<circle class="inner" cx={$spotPosition.x} cy={$spotPosition.y} r={2} />
		</svg>
	{/if}
	{#if width !== undefined}
		<canvas id="bg-canvas" class="absolute0 z-1" bind:this={canvas} />
	{/if}
	{#if displayedFreq}
		<div class="freq w-100 absolute z-1 flex items-start justify-center l-0 b-4">
			<div>
				{displayedFreq}
				<span class="unit">hz</span>
			</div>
		</div>
	{/if}
	<div
		class="absolute z-3 w-100 h-100"
		on:mousedown|stopPropagation|preventDefault={handlePointerDown}
		on:mouseup|stopPropagation|preventDefault={handlePointerUp}
		on:mouseleave|stopPropagation|preventDefault={handlePointerUp}
		on:mousemove|stopPropagation|preventDefault={handlePointerMove}
		on:touchstart|stopPropagation|preventDefault={handlePointerDown}
		on:touchend|stopPropagation|preventDefault={handlePointerUp}
		on:touchcancel|stopPropagation|preventDefault={handlePointerUp}
		on:touchmove|stopPropagation|preventDefault={handlePointerMove}
		bind:clientWidth={width}
		bind:clientHeight={height}
	/>
	<div id="controls" class="absolute z-4 b-0 l-0">
		<div
			class="clickable clickable-icon"
			role="button"
			aria-label="clear"
			on:click|stopPropagation|preventDefault={clear}
		>
			↻
		</div>
	</div>
</div>

<style>
	#bg-canvas {
		opacity: 0.25;
	}
	circle.outer {
		fill: rgba(226, 182, 255, 0.4);
		animation: circle-pulse 1s infinite;
	}
	@keyframes circle-pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.85;
		}
		100% {
			opacity: 1;
		}
	}
	circle.inner {
		fill: rgb(226, 182, 255);
	}
	.freq {
		font-size: 50px;
		color: #fff;
	}
	.unit {
		opacity: 0.6;
	}
</style>
