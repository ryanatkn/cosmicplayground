<script>
	export let classes = '';
	export let contentStyle = '';
	export let contentClasses = '';
</script>

<section class="panel max-column-width p-3 {classes}" on:click|stopPropagation>
	<div class="content p-5 {contentClasses}" style={contentStyle}>
		<slot />
	</div>
</section>

<style>
	.panel {
		border: var(--panel_border);
		border-radius: var(--border_radius_lg);
		margin: var(--spacing_lg) auto;
		padding: 20px;
		background-color: var(--bg_dark);
	}
	.panel + .panel {
		margin-top: 0;
	}
	.content {
		background-color: var(--bg_light);
		border-radius: var(--border_radius_md);
	}
</style>
