<script>
  export let view;
</script>

<div class="button" on:click={() => view.set('main')}>⇠</div>

<style>
  .button {
    cursor: pointer;
    font-size: 80px;
    opacity: 0.6;
    color: hsla(130, 20%, 90%, 0.9);
    transition: transform 0.08s ease-out;
  }
  .button:hover {
    opacity: 0.8;
    transform: scale(1.24, 1.24);
  }
  .button:active {
    opacity: 0.95;
    transform: scale(1.42, 1.42);
  }
</style>