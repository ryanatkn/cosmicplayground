<script lang="ts">
	export let classes = '';
	export let contentStyle = '';
	export let contentClasses = '';
</script>

<section class="panel max-column-width {classes}" on:click|stopPropagation>
	<div class="formatted-content {contentClasses}" style={contentStyle}>
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
		padding: var(--spacing-3);
	}
	.panel + .panel {
		margin-top: 0;
	}
	.formatted-content {
		padding: var(--spacing-5);
		background-color: var(--bg_light);
		border-radius: var(--border_radius_md);
	}
</style>
