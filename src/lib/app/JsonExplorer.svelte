<script>
	export let json;
	export let jsonStr; // this is more verbose for efficiency - probably a more ergonomic way to make it optional tho
</script>

<div class="p-2">
	<!-- TODO await? -->
	{#if json}
		<pre>{jsonStr}</pre>
	{/if}
</div>
