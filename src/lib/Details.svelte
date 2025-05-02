<script lang="ts">
	interface Props {
		summary?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { summary, children }: Props = $props();
	// The native `<details>` tag eagerly renders its content to the DOM,
	// and this component lazily mounts its content instead.
	let open = $state(false);
</script>

<details bind:open>
	{@render summary?.()}
	{#if open}
		{@render children?.()}
	{/if}
</details>
