<script>
	import {onMount} from 'svelte';

	import JsonExplorer from './JsonExplorer.svelte';
	import BundleSummary from './BundleSummary.svelte';
	import LoadingIndicator from './LoadingIndicator.svelte';
	import {toBundleStats} from '../bundle/bundleStats.js';

	/*

	improvements

	- show classes, used and defined (and where they came from!)
	- group by various keys - pkg, dir, external
	- sort
	- filter - search text, external
	- explore rendered/removed exports
	- styling!
	- if it's a svelte file, link to the live thing! (or page/route? hmm)
   
	*/

	export let url;

	const views = [
		{name: 'bundleSummary', title: 'summary'},
		{name: 'jsonExplorer', title: 'json explorer'},
	];
	let activeView = 'bundleSummary'; // TODO take an initial value? wondering about all the different patterns to solve this..

	// I tried another version of this that used {#await ...}
	// but it makes it harder to have control over
	// caching the stringified response json because it's in the tempalte.
	// It can be worked around but the tradeoffs don't appear worth it.

	let bundleData;
	$: stats = toBundleStats(bundleData);
	$: statsStr = JSON.stringify(stats, null, 2); // TODO probably want each chunk/asset separately?

	onMount(async () => {
		// TODO fetch helper?
		const res = await fetch(url);
		console.log(`res`, res);
		bundleData = await res.json();
		console.log(`bundleData`, bundleData);
	});
</script>

<!-- TODO max-width should be a variable, like max-content-width -->
<div class="p-5 mx-auto max-column-width" style="color: #ccc;">
	<nav class="flex mb-4" style="background-color: #171314;">
		{#each views as view (view.name)}
			<div
				class="flex-1 flex justify-center py-2 cursor-pointer {activeView === view.name ? 'font-bold' : ''}"
				on:click={() => (activeView = view.name)}
				class:active={activeView === view.name}>
				<!-- TODO ergonomic way of active class with sy? -->
				{view.title}
			</div>
		{/each}
	</nav>
	{#if stats}
		<div style="background-color: #171314;">
			{#if activeView === 'bundleSummary'}
				<BundleSummary {stats} {statsStr} />
			{:else if activeView === 'jsonExplorer'}
				<JsonExplorer json={stats} jsonStr={statsStr} />
			{/if}
		</div>
	{:else}
		<LoadingIndicator />
	{/if}
</div>

<style>
	/* TODO proper styling w/ nav button components */
	nav > div:hover {
		background-color: #1f1213;
	}
	nav > div:active {
		background-color: #221314;
	}
	nav .active,
	nav .active:hover {
		background-color: #271314;
	}
</style>
