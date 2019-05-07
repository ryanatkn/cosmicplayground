<script>
  import {spring} from 'svelte/motion';

  import {createAudioCtx} from '../audio/audioCtx';
  import {mix} from '../utils/math';
  import {volumeToGain, SMOOTH_GAIN_TIME_CONSTANT} from '../audio/utils';

  let clientWidth;
  let clientHeight;

  let audioCtx;
  const initAudioCtx = () => {
    audioCtx = createAudioCtx();
  };

  let spotPosition = spring({x: -100, y: -100}, {
    stiffness: 0.12,
    damping: 0.32,
  });

  let osc;
  let gain;

  let freq;
  let volume;
  $: displayedVolume = volume === undefined ? '' : Math.round(volume * 100);
  $: displayedFreq = freq === undefined ? '' : Math.round(freq);

  const setFreq = f => {
    osc.frequency.setTargetAtTime(f, 0, 0.02);
    freq = f;
  };
  const setVolume = v => {
    const gainValue = volumeToGain(v);
    gain.gain.setTargetAtTime(gainValue, 0, SMOOTH_GAIN_TIME_CONSTANT);
    volume = v;
  };

  const start = () => {
    if (!audioCtx) initAudioCtx();
    gain = audioCtx.createGain();
    gain.gain.value = 0;
    gain.connect(audioCtx.destination);
    osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.connect(gain);
  };
  const stop = () => {
    gain.gain.setTargetAtTime(0, 0, SMOOTH_GAIN_TIME_CONSTANT);
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

  const handleMouseDown = e => {
    start();
    updateValues(e.clientX, e.clientY, clientWidth, clientHeight);
    osc.start();
  };
  const handleMouseUp = () => {
    if (!audioCtx || !osc) return;
    stop();
  };
  const handleMouseMove = e => {
    if (!audioCtx || !osc) return;
    updateValues(e.clientX, e.clientY, clientWidth, clientHeight);
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
    on:mousedown={handleMouseDown}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    on:mousemove={handleMouseMove}
    on:touchstart={handleMouseDown}
    on:touchend={handleMouseUp}
    on:touchcancel={handleMouseUp}
    on:touchmove={handleMouseMove}
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
    bottom: 20px;
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