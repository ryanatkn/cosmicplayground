<script lang="ts">
	import Breadcrumbs from '@feltcoop/felt/ui/Breadcrumbs.svelte';
	import {scale} from 'svelte/transition';

	import Panel from '$lib/app/Panel.svelte';
	import StarshipPreview from '$lib/portals/home/Preview.svelte';
	import AboutPreview from '$lib/portals/about/Preview.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';
	import type {ClockStore} from '$lib/app/clock';

	export let clock: ClockStore; // TODO or use context?
	// TODO refactor
	export let exit: () => void;
	export let starshipMode: boolean;
	export let toggleStarshipMode: () => void;
	export let resetScores: (() => void) | undefined;
	export let importScores: (() => void) | undefined;

	// TODO BLOCK
	/*

	what should the API for the main menu be like?

	maybe `MainDialogMenuEntry` or `MenuEntry` or something
	could be a component that could be mounted anywhere,
	and adds its contents to the main dialog menu

	*/
</script>

<div class="centered">
	<StarshipPreview
		onClick={() => {
			exit();
			toggleStarshipMode();
		}}
		{starshipMode}
	/>
</div>
<Panel
	><div class="markup centered">
		<section>
			<h2>controls</h2>
			<table>
				<thead><th>key</th><th>action</th></thead><tr
					><td><code>Space</code></td><td>toggle starship game</td></tr
				><tr><td><code>Escape</code></td><td>toggle main menu</td></tr><tr
					><td><code>Backtick `</code></td><td
						>toggle clock (currently {#if $clock.running}running{:else}paused{/if})</td
					></tr
				>
			</table>
		</section>
	</div>
</Panel>
{#if resetScores || importScores}
	<div transition:scale|local>
		<Panel>
			<div class="markup">
				<h2>scores</h2>
				<div class="centered-hz">
					{#if resetScores}
						<button on:click={resetScores}>reset scores</button>
					{/if}
					{#if importScores}
						<button on:click={importScores}>import scores</button>
					{/if}
				</div>
			</div>
		</Panel>
	</div>
{/if}
<Panel>
	<div class="markup centered">
		<section>
			<Breadcrumbs>🌠</Breadcrumbs>
		</section>
	</div>
</Panel>
<PortalPreview href="/about">
	<AboutPreview />
</PortalPreview>

<style>
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
	h2 {
		text-align: center;
	}
	section {
		margin-bottom: var(--spacing_xl7);
	}
</style>
