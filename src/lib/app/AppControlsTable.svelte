<script lang="ts">
	import {page} from '$app/stores';
	import type {ClockStore} from '@ryanatkn/dealt/clock.js';

	import Panel from '$lib/app/Panel.svelte';

	export let clock: ClockStore; // TODO or use context?

	$: navLevel = $page.url.pathname === '/' ? 0 : $page.url.pathname.split('/').length - 1;
</script>

<Panel
	><div class="prose box">
		<section>
			<h2>controls</h2>
			<table>
				<thead><th>key</th><th>action</th></thead><slot />
				<tr><td><code>[Escape]</code></td><td>toggle main menu</td></tr>
				<tr>
					<td><code>[Backtick `]</code></td><td
						>toggle clock (is {#if $clock.running}running{:else}paused{/if})</td
					>
				</tr>
				<tr>
					<td><code>[shift+Escape]</code></td><td
						>navigate upwards ({#if navLevel === 0}you're at the top{:else if navLevel === 1}there's
							one level above you{:else}there's {navLevel} levels above you{/if})</td
					>
				</tr>
				<slot name="end" />
			</table>
		</section>
	</div>
</Panel>

<style>
	h2 {
		text-align: center;
	}
</style>
