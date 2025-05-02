<script lang="ts">
	import {page} from '$app/state';
	import type {ClockStore} from '$lib/clock.js';

	import Panel from '$lib/Panel.svelte';

	interface Props {
		clock: ClockStore; // TODO or use context?
		children?: import('svelte').Snippet;
		end?: import('svelte').Snippet;
	}

	let {clock, children, end}: Props = $props();

	let navLevel = $derived(page.url.pathname === '/' ? 0 : page.url.pathname.split('/').length - 1);
</script>

<Panel
	><div class="box">
		<section>
			<h2 class="mt_0">Controls</h2>
			<table>
				<thead>
					<tr><th>key</th><th>action</th></tr>
				</thead>
				<tbody>
					{@render children?.()}
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
					{@render end?.()}
				</tbody>
			</table>
		</section>
	</div>
</Panel>

<style>
	h2 {
		text-align: center;
	}
</style>
