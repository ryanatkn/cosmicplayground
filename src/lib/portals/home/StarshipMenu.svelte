<script lang="ts">
	import {scale} from 'svelte/transition';
	import {page} from '$app/stores';

	import Panel from '$lib/app/Panel.svelte';
	import StarshipPreview from '$lib/portals/home/Preview.svelte';
	import type {ClockStore} from '$lib/app/clock';
	import StarshipStageScore from '$lib/portals/home/StarshipStageScore.svelte';
	import type {StarshipStageScores} from '$lib/portals/home/starshipStage';

	export let clock: ClockStore; // TODO or use context?
	// TODO refactor
	export let exit: () => void;
	export let starshipMode: boolean;
	export let toggleStarshipMode: () => void;
	export let resetScores: (() => void) | undefined;
	export let importScores: (() => void) | undefined;
	export let scores: StarshipStageScores | undefined;

	$: navLevel = $page.url.pathname === '/' ? 0 : $page.url.pathname.split('/').length - 1;
</script>

<div class="wrapper">
	<div class="starship-preview">
		<StarshipPreview
			onClick={() => {
				exit();
				toggleStarshipMode();
			}}
			{starshipMode}
			><div style:font-size="var(--font_size_xl3)" style:font-weight="300">
				{#if starshipMode}exit{:else}play{/if}
			</div></StarshipPreview
		>
	</div>
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
					{#if scores}
						<br />
						<StarshipStageScore {scores} defaultIcon="❔" />
						<br />
						<p class="centered">
							{#if scores.crewRescuedAtOnceCount >= 5}
								<a href="/gravity-unlock">full crew ready</a>
							{:else if scores.crewRescuedAtOnceCount}
								{scores.crewRescuedAtOnceCount} crewmember{#if scores.crewRescuedAtOnceCount !== 1}s{/if}
								rescued at once
							{:else}
								no crewmembers have been rescued
							{/if}
						</p>
					{/if}
				</div>
			</Panel>
		</div>
	{/if}
	<!-- TODO extract controls so they appear in the main app menu at all times, can hook into them -->
	<Panel
		><div class="markup centered">
			<section>
				<h2>controls</h2>
				<table>
					<thead><th>key</th><th>action</th></thead><tr
						><td><code>Escape</code></td><td>toggle main menu</td></tr
					><tr><td><code>Space</code></td><td>toggle starship game</td></tr><tr
						><td><code>Backtick `</code></td><td
							>toggle clock (is {#if $clock.running}running{:else}paused{/if})</td
						></tr
					><tr
						><td><code>ctrl+Escape</code></td><td
							>navigate upwards ({#if navLevel === 0}you're at the top{:else if navLevel === 1}there's
								one level above you{:else}there's {navLevel} levels above you{/if})</td
						></tr
					>
				</table>
			</section>
		</div>
	</Panel>
</div>

<style>
	.wrapper {
		padding: 0 var(--spacing_sm);
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
	h2 {
		text-align: center;
	}
	section {
		margin-bottom: var(--spacing_xl7);
	}
	.starship-preview {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* TODO hacky */
	.starship-preview :global(.portal-preview) {
		margin: 0;
	}
</style>
