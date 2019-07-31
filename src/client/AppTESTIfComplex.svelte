<script lang="ts">
	export let name: string | undefined;
</script>

{#if name === ''}
	{#if 0}1{/if}
	empty name
{:else if name}
	{#if true}1{/if}
	name: {name.toUpperCase()}
{:else}
	{#if false}1{/if}
	no name
{/if}
