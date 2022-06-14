<script lang="ts">
	import {page} from '$app/stores';

	import Panel from '$lib/app/Panel.svelte';
	import type {ClockStore} from '$lib/app/clock';

	export let clock: ClockStore; // TODO or use context?

	$: navLevel = $page.url.pathname === '/' ? 0 : $page.url.pathname.split('/').length - 1;
</script>

<Panel
	><div class="markup centered">
		<section>
			<h2>controls</h2>
			<table>
				<thead><th>key</th><th>action</th></thead><tr
					><td><code>Space</code></td><td>reset simulation</td></tr
				><tr
					><td><code>Backtick `</code></td><td
						>toggle clock (is {#if $clock.running}running{:else}paused{/if})</td
					></tr
				><tr><td><code>ctrl+S</code></td><td>save to local storage</td></tr><tr
					><td><code>ctrl+Escape</code></td><td
						>navigate upwards ({#if navLevel === 0}you're at the top{:else if navLevel === 1}there's
							one level above you{:else}there's {navLevel} levels above you{/if})</td
					></tr
				>
			</table>
		</section>
	</div>
</Panel>

<style>
	h2 {
		text-align: center;
	}
	/* TODO upstream */
	td {
		padding: var(--spacing_sm);
	}
	tr:hover {
		background-color: var(--tint_light_1);
	}
	th {
		text-align: left;
		font-weight: 300;
		font-size: var(--font_size_xl);
		padding: var(--spacing_sm);
	}
</style>
