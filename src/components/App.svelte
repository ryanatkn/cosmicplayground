<script>
  import {onMount} from 'svelte';
  import {writable} from 'svelte/store';

  import {createClock} from '../stores/clock.js';
  import Overlay from './Overlay.svelte';
  import GalaxyBg from './GalaxyBg.svelte';
  import Construction from './Construction.svelte';
  import About from './About.svelte';
  import ClockControls from './ClockControls.svelte';
  import CommunityLinks from './CommunityLinks.svelte';
  import BackButton from './BackButton.svelte';
  import FreqSpeeds1 from './FreqSpeeds1.svelte';
  import FreqSpeeds0 from './FreqSpeeds0.svelte';
  import HearingTest from './HearingTest.svelte';

  export let name;

  // TODO refactor all of this view code with proper routing
  export let view = writable('main'); // main | about | freqSpeeds0 | freqSpeeds1 | construction | hearingTest

  export let windowWidth = window.innerWidth;
  export let windowHeight = window.innerHeight;

  export let clock = createClock();
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}/>

<section class="bg">
  <GalaxyBg running={$clock.running}></GalaxyBg>
</section>

{#if $view === 'main'}
  <section class="menu">
    <nav>
      <ul class="thumbnails">
        <li class="thumbnail" on:click={() => view.set('about')}>
          <div style="padding: 4px; display: flex; flex-direction: column; align-items: center;">
            <div style="font-size: 30px; margin: 20px 0;">
              {name}
            </div>
            <div>help, about, credits</div>
          </div>
        </li>
        <li class="thumbnail" on:click={() => view.set('hearingTest')}>
          <div style="font-size: 20px;">
            hearing test
          </div>
        </li>
        <li class="thumbnail" on:click={() => view.set('freqSpeeds1')} style="display: flex; flex-direction: column;">
          <FreqSpeeds1 elapsedTime={$clock.time} width={300} height={75} hzItems={[4]} lowestHzItemCount={2}></FreqSpeeds1>
          <FreqSpeeds1 elapsedTime={$clock.time} width={300} height={75} hzItems={[4]} lowestHzItemCount={2} style="transform: rotate(180deg);"></FreqSpeeds1>
        </li>
        <li class="thumbnail" on:click={() => view.set('freqSpeeds0')} style="display: flex;">
          <FreqSpeeds0 elapsedTime={$clock.time} width={150} height={75} hzItems={[2, 3]} lowestHzItemCount={1}></FreqSpeeds0>
          <FreqSpeeds0 elapsedTime={$clock.time} width={150} height={75} hzItems={[4, 5]} lowestHzItemCount={1} style="transform: rotate(180deg);"></FreqSpeeds0>
        </li>
        <li class="thumbnail" on:click={() => view.set('construction')}>
          {#if $clock.running}
            <img src="assets/construction/construction_person_rock.gif"
              alt="under construction: person rock" style="width: 162px; height: 100px;" class="pixelated thumbnail-construction"/>
          {:else}
            <img src="assets/construction/construction_person_rock_pause.png"
              alt="under construction: person rock" style="width: 162px; height: 100px; filter: grayscale(100%);" class="pixelated"/>
          {/if}
        </li>
      </ul>
    </nav>
  </section>
{:else if $view === 'about'}
  <section class="content" on:click={() => view.set('main')} style="padding: 20px;">
    <div class="back-button-wrapper">
      <BackButton view={view}/>
    </div>
    <div style="margin-top: 90px;">
      <Overlay>
        <About name={name}>
          <div style="display: flex; align-items: center;">
            <div style="padding: 12px; border: 3px dashed rgba(0, 0, 0, 0.3); background: rgba(0, 0, 0, 0.15); display: flex;">
              <ClockControls time={$clock.time} running={$clock.running} pause={clock.pause} resume={clock.resume}/>
            </div>
          </div>
        </About>
      </Overlay>
    </div>
  </section>
{:else if $view === 'hearingTest'}
  <section class="content">
    <div class="back-button-wrapper">
      <BackButton view={view}/>
    </div>
    <HearingTest/>
  </section>
{:else if $view === 'freqSpeeds0'}
  <section class="content" on:click={clock.toggle}>
    <div class="back-button-wrapper">
      <BackButton view={view}/>
    </div>
    <FreqSpeeds0 width={windowWidth} height={windowHeight * 0.7} elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds0>
    <div style="display: flex; justify-content: center;">
      <div style="flex: 0; display: flex; flex-direction: column;">
        <FreqSpeeds0 width={windowWidth * 0.25} height={windowHeight * 0.15} style="transform: rotate(180deg);" elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds0>
        <FreqSpeeds0 width={windowWidth * 0.25} height={windowHeight * 0.15} elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds0>
      </div>
      <FreqSpeeds0 width={windowWidth * 0.5} height={windowHeight * 0.3} style="transform: rotate(180deg);" elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds0>
      <div style="flex: 0; display: flex; flex-direction: column;">
        <FreqSpeeds0 width={windowWidth * 0.25} height={windowHeight * 0.15}  style="transform: rotate(180deg);" elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds0>
        <FreqSpeeds0 width={windowWidth * 0.25} height={windowHeight * 0.15} elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds0>
      </div>
    </div>
  </section>
{:else if $view === 'freqSpeeds1'}
  <section class="content" on:click={clock.toggle}>
    <div class="back-button-wrapper">
      <BackButton view={view}/>
    </div>
    <FreqSpeeds1 width={windowWidth} height={windowHeight / 2} elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds1>
    <FreqSpeeds1 width={windowWidth} height={windowHeight / 2} style="transform: rotate(180deg);" elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds1>
  </section>
{:else if $view === 'construction'}
  <section class="content">
    <div class="back-button-wrapper">
      <BackButton view={view}/>
    </div>
    <Construction running={$clock.running}></Construction>
  </section>
{:else}
  <section class="content" style="display: flex;" on:click={() => view.set('main')}>
    <Overlay>
      <div class="back-button-wrapper">
        <BackButton view={view}/>
      </div>
      <h2>unknown view: {$view}</h2>
    </Overlay>
  </section>
{/if}

<style>
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
  }
  .content > section {
    position: relative;
  }
  .thumbnails {
    list-style-type: none;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .thumbnail {
    cursor: pointer;
    position: relative;
    z-index: 2;
    opacity: 0.7;
    padding: 12px;
    border: 3px dashed rgba(255, 255, 255, 0.3);
    margin: 12px;
    color: #fff;
  }
  .thumbnail:hover {
    opacity: 0.85;
    border-width: 5px;
    padding: 10px;
    /* TODO the padding needs to be reduced as the border increases - should do this with some code instead of manually - PostCSS? */
  }
  .thumbnail:active {
    opacity: 0.95;
    border-style: double;
  }
  .thumbnail-construction {
    animation: rotate-pulse 1s infinite ease-in-out;
  }
  @keyframes rotate-pulse {
    0% {
      transform: rotate3d(-0.9, 1.0, 0.2, 15deg);
    }
    50% {
      transform: rotate3d(0.7, -0.5, -0.2, 15deg);
    }
    100% {
      transform: rotate3d(-0.9, 1.0, 0.2, 15deg);
    }
  }
  .back-button-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 20px;
    z-index: 10;
  }

  :global(*) {
    /* before/after? normalize.css? */
    box-sizing: border-box;
  }

  :global(html) {
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: sans-serif;
  }
  :global(body) {
    height: 100%;
    padding: 0;
    margin: 0;
    background-color: #000;
  }
  :global(#root) {
    height: 100%;
    position: relative;
  }

  :global(.pixelated) {
    image-rendering: -webkit-optimize-contrast; /* Safari */
    image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
    image-rendering: pixelated; /* in case crisp-edges isn't supported */
    image-rendering: crisp-edges; /* the recommended pixel art setting according to MDN */
  }
</style>
