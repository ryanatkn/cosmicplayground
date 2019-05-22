<script>
  import {spring} from 'svelte/motion';
  import {onMount} from 'svelte';

  import {createAudioCtx} from '../audio/audioCtx.js';
  import {mix} from '../utils/math.js';
  import {volumeToGain, SMOOTH_GAIN_TIME_CONSTANT} from '../audio/utils.js';
  import {hslToRgb} from '../utils/colors.js';
  import {freqToMidi} from '../music/midi.js';
  import {DEFAULT_TUNING} from '../music/constants.js';

  /*
  
  ideas
  - support painting with a closed shape, not just lines
  - are there other interesting ways to convey octave differences?
  - interval bands? maybe separate button half into chunky intervals
  - blended colors instead of nearest chroma?
  - trail history
    - bug - lines will change freq after page resize
    - repeat/move
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
    if (!canvasCtx) canvasCtx = canvas.getContext('2d');
    if (canvasData && canvasData.width === width && canvasData.height === height) return;
    canvas.width = width;
    canvas.height = height;
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
  $: if (pointerX >= 0) {
    // this won't work for replaying sounds - we'd need to store lines every frame instead of pointer changes
    const point = ` ${pointerX},${pointerY}`;
    const line = lines[lines.length - 1];
    if (line.points) {
      line.points += point;
    } else {
      // draw the initial point as a tiny line, so individual points appear onscreen
      line.points = `${pointerX - 3},${pointerY - 3}${point}`;
    }
    lines = lines;
  };

  let audioCtx;
  const initAudioCtx = () => { // TODO store and/or context
    audioCtx = createAudioCtx();
  };

  let spotPosition = spring({x: pointerX, y: pointerY}, {
    stiffness: 0.08,
    damping: 0.32,
  });
  $: spotPosition.set({x: pointerX, y: pointerY});

  let osc;
  let gain;

  const VOLUME = 0.5; // TODO probably hook into global settings

  $: freq = width ? calcFreq(pointerX, pointerY, width, height) : undefined;
  $: if (osc && freq !== undefined) osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  $: displayedFreq = freq === undefined ? '' : Math.round(freq);

  const start = () => {
    if (osc) return;
    if (!audioCtx) initAudioCtx();
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
    gain.gain.setTargetAtTime(
      0,
      audioCtx.currentTime,
      SMOOTH_GAIN_TIME_CONSTANT,
    );
    osc.stop(audioCtx.currentTime + SMOOTH_GAIN_TIME_CONSTANT * 2);
    osc = undefined;
    gain = undefined;
  };

  const freqMin = 20; // freq is this when x=0
  const freqMax = 6000; // freq is this when x=width
  const yMultMin = 0.5; // freq is multiplied by this value when y=height
  const yMultMax = 1.5; // freq is multiplied by this value when y=0
  const calcFreq = (x, y, w, h) => {
    const yPct = (1 - y / h);
    // get roughly equal frequency bands on the X axis - dunno what the exact math is
    const xPct = Math.pow((x / 2) / w + 0.5, 10);
    return mix(freqMin, freqMax, xPct) * mix(yMultMin, yMultMax, yPct);
  };

  // TODO more cleanly handle touch/click - pointer events with polyfill for Safari? (probably using Svelte actions)
  // or maybe support multiple touches? yeah...that makes sense here.
  const pointerEventX = e => e.touches && e.touches.length
    ? e.touches[0].clientX
    : e.clientX;
  const pointerEventY = e => e.touches && e.touches.length
    ? e.touches[0].clientY
    : e.clientY;
  const handlePointerDown = e => {
    start();
    pointerX = pointerEventX(e);
    pointerY = pointerEventY(e);

    const nextPoint = {id: lines[lines.length - 1].id + 1, points: ''};
    if (e.ctrlKey) {
      lines.push(nextPoint);
      lines = lines;
    } else {
      lines = [nextPoint];
    }
  };
  const handlePointerUp = e => {
    if (!audioCtx || !osc) return;
    stop();
  };
  const handlePointerMove = e => {
    if (!audioCtx || !osc) return;
    if (!e.altKey) pointerX = pointerEventX(e);
    if (!e.shiftKey) pointerY = pointerEventY(e);
  };
</script>

<div class="wrapper">
  {#if $spotPosition}
    <svg>
      <!--
        Chrome doesn't appear to support setting a canvas mask to an svg (it works in Firefox)
        so we use an svg `image` with a `dataUrl` instead.
      -->
      <image xlink:href={fgDataUrl} {width} {height} mask="url(#linePaths)" />      
      <defs>
        <mask id="linePaths">
          {#each lines as line (line.id)}
            <polyline points={line.points} stroke="white" stroke-width="5" fill="none"/>
          {/each}
        </mask>
      </defs>

      <filter id="blurOuter" height="300%" width="300%" y="-50%" x="-50%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
      </filter>
      <circle class="outer" cx={$spotPosition.x} cy={$spotPosition.y} r={30} filter="url(#blurOuter)" />
      <circle class="inner" cx={$spotPosition.x} cy={$spotPosition.y} r={2} />
    </svg>
  {/if}
  {#if width !== undefined}
    <canvas id="bg-canvas" bind:this={canvas}/>
  {/if}
  {#if displayedFreq}
    <div class="freq">
      <div>
        {displayedFreq}<span class="unit">hz</span>
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
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #bg-canvas {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.25;
  }
  .surface {
    z-index: 3;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  svg {
    z-index: 2;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  circle.outer {
    fill: rgba(226, 182, 255, 0.4);
    animation: circle-pulse 1.0s infinite;
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