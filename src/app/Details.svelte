<script>
	// The native `<details>` tag eagerly renders its content to the DOM,
	// and this component lazily mounts its content instead.
	let open = false;
</script>

<details bind:open>
	<summary>
		<slot name="summary" />
	</summary>
	{#if open}
		<slot name="content" />
	{/if}
</details>
