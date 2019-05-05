<script>
  import {onMount} from 'svelte';
  import {writable} from 'svelte/store';

  import {createClock} from '../stores/clock';
  import Overlay from './Overlay.svelte';
  import GalaxyBg from './GalaxyBg.svelte';
  import Construction from './Construction.svelte';
  import About from './About.svelte';
  import ClockControls from './ClockControls.svelte';
  import CommunityLinks from './CommunityLinks.svelte';
  import BackButton from './BackButton.svelte';
  import FreqSpeeds from './FreqSpeeds.svelte';

  export let name;

  // TODO refactor all of this view code with proper routing
  export let view = writable('main'); // main | about | freqSpeeds | freqSpeeds2 | construction

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
          <div style="color: white; padding: 4px;">
            <h1>
              cosmicplayground
            </h1>
            <div style="text-align: right; margin-top: 30px;">help, about, credits</div>
          </div>
        </li>
        <li class="thumbnail" on:click={() => view.set('freqSpeeds2')} style="display: flex; flex-direction: column;">
          <FreqSpeeds elapsedTime={$clock.time} width={400} height={100} hzItems={[10]} lowestHzItemCount={2}></FreqSpeeds><FreqSpeeds elapsedTime={$clock.time} width={400} height={100} hzItems={[10]} lowestHzItemCount={2} style="transform: rotate(180deg);"></FreqSpeeds>
        </li>
        <li class="thumbnail" on:click={() => view.set('freqSpeeds')} style="display: flex;">
        <!-- This is entering a whitespace node if not put on the same line, but prettier isn't working yet anyway! -->
          <FreqSpeeds elapsedTime={$clock.time} width={200} height={100} hzItems={[2, 3]} lowestHzItemCount={1}></FreqSpeeds><FreqSpeeds elapsedTime={$clock.time} width={200} height={100} hzItems={[4, 5]} lowestHzItemCount={1} style="transform: rotate(180deg);"></FreqSpeeds>
        </li>
        <li class={"thumbnail"}>
          <div on:click={() => view.set('construction')} >
            {#if $clock.running}
              <img src="assets/construction/construction_person_rock.gif"
                alt="under construction: person rock" style="width: 162px; height: 100px;" class="pixelated"/>
            {:else}
              <img src="assets/construction/construction_person_rock_pause.png"
                alt="under construction: person rock" style="width: 162px; height: 100px; filter: grayscale(100%);" class="pixelated"/>
            {/if}
          </div>
        </li>
      </ul>
    </nav>
  </section>
{:else if $view === 'about'}
  <section class="content" on:click={() => view.set('main')} style="padding: 20px;">
    <div class="back-button-wrapper">
      <BackButton view={view}/>
    </div>
    <Overlay>
      <About name={name}>
        <div style="display: flex; align-items: center;">
          <div style="padding: 12px; border: 3px dashed rgba(0, 0, 0, 0.3); background: rgba(0, 0, 0, 0.15); display: flex;">
            <ClockControls time={$clock.time} running={$clock.running} pause={clock.pause} resume={clock.resume}/>
          </div>
        </div>
      </About>
    </Overlay>
  </section>
{:else if $view === 'freqSpeeds'}
  <section class="content" on:click={clock.toggle}>
    <div class="back-button-wrapper">
      <BackButton view={view}/>
    </div>
    <FreqSpeeds width={windowWidth} height={windowHeight * 0.7} elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds>
    <div style="display: flex; justify-content: center;">
      <div style="flex: 0; display: flex; flex-direction: column;">
        <FreqSpeeds width={windowWidth * 0.25} height={windowHeight * 0.15} style="transform: rotate(180deg);" elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds>
        <FreqSpeeds width={windowWidth * 0.25} height={windowHeight * 0.15} elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds>
      </div>
      <FreqSpeeds width={windowWidth * 0.5} height={windowHeight * 0.3} style="transform: rotate(180deg);" elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds>
      <div style="flex: 0; display: flex; flex-direction: column;">
        <FreqSpeeds width={windowWidth * 0.25} height={windowHeight * 0.15}  style="transform: rotate(180deg);" elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds>
        <FreqSpeeds width={windowWidth * 0.25} height={windowHeight * 0.15} elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}></FreqSpeeds>
      </div>
    </div>
  </section>
{:else if $view === 'freqSpeeds2'}
  <section class="content" on:click={clock.toggle}>
    <div class="back-button-wrapper">
      <BackButton view={view}/>
    </div>
    <FreqSpeeds width={windowWidth} height={windowHeight / 2} elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10]}></FreqSpeeds>
    <FreqSpeeds width={windowWidth} height={windowHeight / 2} style="transform: rotate(180deg);" elapsedTime={$clock.time} lowestHzItemCount={2} hzItems={[1, 2, 3, 4, 5, 6, 10]}></FreqSpeeds>
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
    justify-content: center;
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
  }
  .thumbnail:hover {
    opacity: 0.85;
    border-width: 4px;
    padding: 11px;
    /* TODO the padding needs to be reduced as the border increases - should do this with some code instead of manually - PostCSS? */
  }
  .thumbnail:active {
    opacity: 0.95;
    border-width: 5px;
    padding: 10px;
  }
  .back-button-wrapper {
    position: absolute;
    left: 20px;
    top: 0;
    z-index: 2;
  }

  :global(*) {
    /* before/after? normalize.css? */
    box-sizing: border-box;
  }

  :global(html) {
    height: 100%;
    padding: 0;
    margin: 0;
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
