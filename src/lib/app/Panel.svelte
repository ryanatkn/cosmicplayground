<section class="panel width_md">
	<div class="content">
		<slot />
	</div>
</section>

<style>
	.panel {
		border: var(--panel_border);
		border-radius: var(--border_radius_4);
		margin: var(--spacing_xl7) auto;
		padding: 20px;
		background-color: var(--bg);
		padding: var(--spacing-3);
	}
	/* TODO the `:global` was added without checking that it works as expected */
	.panel + :global(.panel) {
		margin-top: 0;
	}
	.content {
		padding: var(--spacing-5);
		background-color: var(--fg_1);
		border-radius: var(--border_radius_3);
	}
	@media (max-width: 580px) {
		.content {
			padding: var(--spacing-2);
		}
	}
</style>
