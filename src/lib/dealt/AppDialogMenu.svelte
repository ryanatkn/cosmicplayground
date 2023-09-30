<script lang="ts">
	import Breadcrumb from '@fuz.dev/fuz_library/Breadcrumb.svelte';
	import {page} from '$app/stores';

	import Clock from './Clock.svelte';

	let cleared = false;
</script>

<div class:cleared>
	{#if $page.url.pathname !== '/'}
		<div class="breadcrumbs">
			<div class="panel padded-md">
				<section class="markup centered">
					<Breadcrumb>🔮</Breadcrumb>
				</section>
				<section class="pane padded-md centered">
					<Clock />
				</section>
				<section class="pane padded-md">
					<button
						on:click={() => {
							cleared = false;
							if (
								// eslint-disable-next-line no-alert
								confirm(
									'are you sure you want to delete all of your saved data? this cannot be undone',
								)
							) {
								localStorage.clear();
								cleared = true;
							}
						}}
					>
						<span class="trash-icon">🗑️</span> delete saved data
					</button>
				</section>
			</div>
			<div class="markup centered">
				<Breadcrumb>🔮</Breadcrumb>
			</div>
		</div>
	{/if}
</div>

<style>
	.breadcrumbs {
		/* TODO don't hardcode */
		padding: 12px;
	}
	/* TODO hacky */
	.breadcrumbs :global(.panel) {
		margin-top: 0;
	}
	.trash-icon {
		font-size: var(--icon_size_md);
		padding: 0 var(--spacing_md);
		transition: var(--duration_3) rotate ease-in-out;
		rotate: 0deg;
	}
	.cleared .trash-icon {
		rotate: 152deg;
	}
</style>
