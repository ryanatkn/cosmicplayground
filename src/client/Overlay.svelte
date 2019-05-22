<script>
	// ...
</script>

<div class="wrapper" on:click|stopPropagation>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	.wrapper {
		padding: 12px;
		border: 3px dashed rgba(255, 255, 255, 0.3);
	}
	.content {
		background-color: rgba(255, 255, 255, 0.8);
		padding: 4px;
	}
</style>
