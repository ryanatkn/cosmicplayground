<script>
	export let contentStyle = '';
	export let contentClass = 'p-1';
</script>

<style>
	.wrapper {
		border: 3px dashed rgba(255, 255, 255, 0.3);
	}
	.content {
		background-color: rgba(255, 255, 255, 0.8);
	}
</style>

<div class="wrapper p-3" on:click|stopPropagation>
	<div class="content {contentClass}" style={contentStyle}>
		<slot />
	</div>
</div>
