<section class="panel">
	<div class="content">
		<slot />
	</div>
</section>

<style>
	.panel {
		border: var(--panel_border);
		border-radius: var(--border_radius_xl4);
		margin: var(--space_xl7) auto;
		padding: 20px;
		background-color: transparent;
		padding: var(--spacing-3);
	}
	/* TODO the `:global` was added without checking that it works as expected */
	.panel + :global(.panel) {
		margin-top: 0;
	}
	.content {
		padding: var(--spacing-5);
		background-color: var(--bg);
		border-radius: var(--border_radius_xl3);
	}
	@media (max-width: 580px) {
		.content {
			padding: var(--spacing-2);
		}
	}
</style>
