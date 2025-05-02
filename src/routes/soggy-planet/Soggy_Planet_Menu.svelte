<script lang="ts">
	import type {ClockStore} from '$lib/clock.js';

	import AppControlsTable from '$lib/AppControlsTable.svelte';
	import {settings_context} from '$lib/settings.js';

	interface Props {
		clock: ClockStore; // TODO or use context?
	}

	let { clock }: Props = $props();

	const settings = settings_context.get();
	let dev_mode = $derived($settings.dev_mode);
</script>

<div class="wrapper">
	<AppControlsTable {clock}>
		{#snippet end()}
			
				<tr>
					<td><code>[shift+Backtick `]</code></td><td
						>toggle dev mode (currently <code>{dev_mode}</code>)</td
					>
				</tr>
			
			{/snippet}
	</AppControlsTable>
</div>

<style>
	.wrapper {
		padding: 0 var(--space_sm);
	}
</style>
