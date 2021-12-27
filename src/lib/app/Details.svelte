<script lang="ts">
	// The native `<details>` tag eagerly renders its content to the DOM,
	// and this component lazily mounts its content instead.
	let open = false;
</script>

<details bind:open>
	<slot name="summary" />
	{#if open}
		<slot name="details" />
	{/if}
</details>
