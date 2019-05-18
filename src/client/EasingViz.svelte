<script>
  /*
  
  Svelte has built-in support for ergonomic and high performance animations.
  It includes a number of easing functions that transition your values from
  start to finish with a flair ranging from vanilla to delightful to well past zany.
  This component visualizes the included easings
  using translate/rotate/scale CSS transforms.
  See the relevant section of Svelte's tutorial -
  https://svelte.dev/tutorial/tweened -
  which also links the Penner easing equations - http://robertpenner.com/easing/
  
  notes
  - there are some really weird visual artifacts when values are near 0
    in Chrome (both versions 74 on Windows and 73 on Linux), but not Firefox
  - when things are animating, the `select` input goes nuts in Firefox, but not Chrome
  - major optimizations could be made, probably
    - I'd be grateful for any pointers
    - I profiled the commented out code that uses `filteredTweens` below in Chrome,
      and it seems to use a lot more memory (like 50% more).
      The current and better performing version doesn't create a filtered collection,
      and instead uses `{#if isVisible(item)}`.
      The scripting/rendering/painting characteristics are similar in the two versions.
      I only profiled a handful of times for ~20 seconds,
      and I don't have much experience profiling, so I could be wrong about everything.
  - what could be more idiomatic or clear?
  
  */

  import {onDestroy} from 'svelte';
  import {createTweens} from './tweens.js';

  let duration = 1500;
  //$: console.log('duration changed', duration);

  let toggle = false;
  //$: console.log('toggle changed', toggle);

  let timeout;
  const loopPadding = 300; // time to wait between loops
  const loop = time => {
    timeout = setTimeout(() => {
      toggle = !toggle;
      loop(duration + loopPadding);
    }, time);
  };
  const startPlaying = () => loop(0);
  const stopPlaying = () => clearTimeout(timeout);
  onDestroy(stopPlaying);

  const views = ['all', 'selected', 'unselected'];
  let view = 'selected';
  //$: console.log('view changed', view);
  let playing = false;
  $: playing ? startPlaying() : stopPlaying();
  //$: console.log('playing changed', playing);

  const tweens = createTweens(duration);
  $: tweens.set(toggle ? 1 : 0, {duration}); //, console.log('tweens.set()');

  $: selected = tweens.names.reduce((v = {}, k) => {
    if (!(k in v)) v[k] = true;
    return v;
  }, selected);
  //$: console.log('selected changed', selected);

  const graphicWidth = 24;
  const graphicHeight = 24;
  const translateWidth = 300;
  const translateDistance = translateWidth - graphicWidth;

  const isVisible = tween => {
    //console.log("isVisible", view);
    switch (view) {
      case 'all':
        return true;
      case 'selected':
        return selected[tween.name];
      case 'unselected':
        return !selected[tween.name];
    }
  };
  const getColor = (index, opacity = 0.8) =>
    `hsla(${index * 75}deg, 60%, 65%, ${opacity})`;

  /*
  let filteredTweens;
  $: {
    // TODO learn to optimize
    // is it better to compute `filteredTweens` every frame, or use a `{#if isVisible(item)}`?
    //console.log("assign filteredTweens", view);
    switch (view) {
      case 'all': filteredTweens = $tweens; break;
      case 'selected': filteredTweens = $tweens.filter(e => selected[e.name]); break;
      case 'unselected': filteredTweens = $tweens.filter(e => !selected[e.name]); break;
    }
  };
  */
</script>

<section class="controls">
  <div class="controls-group">
    <button
      class="loop-button"
      on:click={() => (playing = !playing)}
      type="button">
      {playing ? 'pause' : 'play'}
    </button>
    <button
      class="toggle-button"
      on:click={() => (toggle = !toggle)}
      type="button">
      toggle
    </button>
    <select bind:value={view}>
      {#each views as view (view)}
        <option value={view}>view {view}</option>
      {/each}
    </select>
  </div>
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
</section>

<section>
  {#each $tweens as item, i (item.name)}
    {#if isVisible(item)}
      <div
        class="item"
        style="width: {translateWidth}px; background-color: {getColor(i, 0.1)};">
        <div
          class="item-graphic-scale"
          style="transform: scale3d({item.value}, {item.value}, 1); width: {graphicWidth}px;
          height: {graphicHeight}px; background-color: {getColor(i)};" />
        <div
          class="item-graphic-rotate"
          style="transform: rotate({item.value * 180}deg); height: {graphicHeight}px;
          background-color: {getColor(i)};" />
        <div
          class="item-graphic-translate"
          style="transform: translate3d({item.value * translateDistance}px, 0,
          0); width: {graphicWidth}px; height: {graphicHeight}px;
          background-color: {getColor(i)};" />
        <label class="item-label" style="color: {getColor(i)};">
          <input
            type="checkbox"
            checked={selected[item.name]}
            on:change={() => (selected[item.name] = !selected[item.name])} />
          <span style="list-style: {selected[item.name] ? 'circle' : 'none'}">{item.name}</span>
        </label>
      </div>
    {/if}
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
  }
  .loop-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75px;
  }
  .toggle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75px;
  }
  .item {
    position: relative;
    display: flex;
    margin-top: 6px;
  }
  /*.item-graphic-translate {}*/
  .item-graphic-rotate {
    position: absolute;
    right: -200px;
    top: 0;
    width: 3px;
    transform-origin: middle;
  }
  .item-graphic-scale {
    position: absolute;
    right: -250px;
    top: 0;
    border-radius: 50%;
    transform-origin: middle;
  }
  .item-label {
    position: absolute;
    left: 100%;
    top: 0;
    padding-left: 50px;
    display: flex;
    align-items: baseline;
    font-weight: bold;
  }
  .item-label input[type='checkbox'] {
    visibility: hidden;
  }
  .item-label span {
    display: list-item;
  }
  section {
    padding: 15px;
    width: 550px;
  }
  input[type='range'] {
    width: 300px;
  }
  input[type='checkbox'] {
    opacity: 0.8;
    margin-right: 4px;
  }
  select {
    width: 150px;
    height: 40px;
  }
  button {
    height: 40px;
  }
</style>
