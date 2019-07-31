<script lang="ts">
	export let name: string | undefined;
</script>

{#if name}
  name: {name}
{:else}
  no name
{/if}
