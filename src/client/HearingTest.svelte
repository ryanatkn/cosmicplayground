<script>
  import {spring} from 'svelte/motion';

  import {createAudioCtx} from '../audio/audioCtx.js';
  import {mix} from '../utils/math.js';
  import {volumeToGain, SMOOTH_GAIN_TIME_CONSTANT} from '../audio/utils.js';

  let clientWidth;
  let clientHeight;

  let audioCtx;
  const initAudioCtx = () => {
    audioCtx = createAudioCtx();
  };

  let spotPosition = spring({x: -100, y: -100}, {
    stiffness: 0.08,
    damping: 0.32,
  });

  let osc;
  let gain;

  let freq;
  let volume;
  $: displayedVolume = volume === undefined ? '' : Math.round(volume * 100);
  $: displayedFreq = freq === undefined ? '' : Math.round(freq);

  const setFreq = f => {
    osc.frequency.setValueAtTime(f, audioCtx.currentTime);
    freq = f;
  };
  const setVolume = v => {
    const gainValue = volumeToGain(v);
    gain.gain.setTargetAtTime(
      gainValue,
      audioCtx.currentTime,
      SMOOTH_GAIN_TIME_CONSTANT,
    );
    volume = v;
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

  const freqMin = 0;
  const freqMax = 25000;
  const calcFreq = (value, max) => {
    return mix(freqMin, freqMax, value / max);
  };
  const volumeMin = 0;
  const volumeMax = 1;
  const calcVolume = (value, max) => {
    return mix(volumeMin, volumeMax, 1 - value / max);
  };

  const updateValues = (x, y, width, height) => {
    const freq = calcFreq(x, width);
    const volume = calcVolume(y, height);
    setFreq(freq);
    setVolume(volume);
    spotPosition.set({x, y});
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
    e.stopPropagation();
    e.preventDefault();
    start();
    updateValues(pointerEventX(e), pointerEventY(e), clientWidth, clientHeight);
  };
  const handlePointerUp = e => {
    if (!audioCtx || !osc) return;
    e.stopPropagation();
    e.preventDefault();
    stop();
  };
  const handlePointerMove = e => {
    if (!audioCtx || !osc) return;
    e.stopPropagation();
    e.preventDefault();
    updateValues(pointerEventX(e), pointerEventY(e), clientWidth, clientHeight);
  };
</script>

<div class="wrapper">
  {#if $spotPosition}
    <svg>
      <circle class="outer" cx={$spotPosition.x} cy={$spotPosition.y} r={20} />
      <circle class="inner" cx={$spotPosition.x} cy={$spotPosition.y} r={2} />
    </svg>
  {/if}
  {#if volume !== undefined}
    <div class="volume">
      <div>
        {displayedVolume}<span class="unit">%</span>
      </div>
    </div>
  {/if}
  {#if freq !== undefined}
    <div class="freq">
      <div>
        {displayedFreq}<span class="unit">hz</span>
      </div>
    </div>
  {/if}
  <div
    class="surface"
    on:mousedown={handlePointerDown}
    on:mouseup={handlePointerUp}
    on:mouseleave={handlePointerUp}
    on:mousemove={handlePointerMove}
    on:touchstart={handlePointerDown}
    on:touchend={handlePointerUp}
    on:touchcancel={handlePointerUp}
    on:touchmove={handlePointerMove}
    bind:clientWidth
    bind:clientHeight />
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
    filter: blur(10px);
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