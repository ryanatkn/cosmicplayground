<script lang="ts">
	import type {ClockStore} from '$lib/clock.js';

	import AppControlsTable from '$lib/AppControlsTable.svelte';
	import {settings_context} from '$lib/settings.js';

	export let clock: ClockStore; // TODO or use context?

	const settings = settings_context.get();
	$: dev_mode = $settings.dev_mode;
</script>

<div class="wrapper">
	<AppControlsTable {clock}>
		<svelte:fragment slot="end">
			<tr>
				<td><code>[shift+Backtick `]</code></td><td
					>toggle dev mode (currently <code>{dev_mode}</code>)</td
				>
			</tr>
		</svelte:fragment>
	</AppControlsTable>
</div>

<style>
	.wrapper {
		padding: 0 var(--space_sm);
	}
</style>
