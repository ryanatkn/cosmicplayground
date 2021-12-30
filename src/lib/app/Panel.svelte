<section class="panel max-column-width" on:click|stopPropagation>
	<div class="panel-content">
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
	/* TODO the `:global` was added without checking that it works as expected */
	.panel + :global(.panel) {
		margin-top: 0;
	}
	.panel-content {
		padding: var(--spacing-5);
		background-color: var(--bg_light);
		border-radius: var(--border_radius_md);
	}
</style>
