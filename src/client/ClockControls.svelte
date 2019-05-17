<script>
 import FreqSpeeds0 from './FreqSpeeds0.svelte';

 // TODO what are the perf characteristics if we use the clock store directly?
 // will anything get updated unnecessarily every frame?

 export let time;
 export let running;
 export let pause;
 export let resume;
</script>

<div class="wrapper">
  {#if running}
    <img on:click={pause} src="assets/construction/construction_person_rock.gif"
      alt="under construction: person_rock"
      class="rock pixelated" />
    <button type="button" class="toggle-button" on:click={pause}>
      <div style="font-size: 24px">▮▮</div>
      pause universe clock
    </button>
  {:else}
    <img on:click={resume} src="assets/construction/construction_person_rock_pause.png"
      alt="under construction: person_rock_pause"
      class="rock pixelated" style="filter: grayscale(100%);" />
    <button type="button" class="toggle-button" on:click={resume}>
      <div style="font-size: 24px">▶</div>
      resume universe clock
    </button>
  {/if}
  <div on:click={() => running ? pause() : resume()}>
    <FreqSpeeds0 elapsedTime={time} width={150} height={80} hzItems={[1, 3, 10]} lowestHzItemCount={2}></FreqSpeeds0>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .rock {
    width: 120px;
    height: 80px;
  }
  .rock:hover {
    transform: scale3d(1.1, 1.1, 1);
  }
  .rock:active {
    transform: scale3d(1.2, 1.2, 1);
  }
  .toggle-button {
    width: 230px;
    height: 80px;
  }
</style>
