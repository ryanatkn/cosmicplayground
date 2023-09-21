<script lang="ts">
	import type {ClockStore} from '@ryanatkn/dealt';

	import AppControlsTable from '$lib/app/AppControlsTable.svelte';
	import {get_settings} from '$lib/app/settings';

	export let clock: ClockStore; // TODO or use context?

	const settings = get_settings();
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
		padding: 0 var(--spacing_sm);
	}
</style>
