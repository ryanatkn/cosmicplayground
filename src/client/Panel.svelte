<script>
	export let classes = '';
	export let contentStyle = '';
	export let contentClasses = '';
</script>

<div class="panel max-column-width p-3 {classes}" on:click|stopPropagation>
	<div class="content p-5 {contentClasses}" style={contentStyle}>
		<slot />
	</div>
</div>

<style>
	.panel {
		border: var(--panel_border);
		border-radius: var(--panel_border_radius);
		margin: 50px auto;
		padding: 20px;
	}
	.content {
		background-color: var(--bg_2);
	}
</style>
