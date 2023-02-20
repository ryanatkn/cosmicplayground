<script lang="ts">
	import {scale} from 'svelte/transition';
	import {wait} from '@feltjs/util/async.js';
	import type {ClockStore} from '@feltcoop/dealt';

	import Panel from '$lib/app/Panel.svelte';
	import StarshipPreview from './Preview.svelte';
	import StarshipStageScore from './StarshipStageScore.svelte';
	import type {StarshipStageScores} from './starshipStage';
	import AppControlsTable from '$lib/app/AppControlsTable.svelte';
	import PortalPreview from '$lib/app/PortalPreview.svelte';

	export let clock: ClockStore; // TODO or use context?
	// TODO refactor
	export let exit: () => void;
	export let starshipMode: boolean;
	export let toggleStarshipMode: () => Promise<void>;
	export let resetScores: (() => void) | undefined;
	export let importScores: (() => void) | undefined;
	export let scores: StarshipStageScores | undefined;
</script>

<div class="wrapper">
	<div class="starship-preview">
		<StarshipPreview
			onClick={async () => {
				exit();
				await toggleStarshipMode();
			}}
			{starshipMode}
			><div class="button-text">
				{#if starshipMode}exit{:else}play{/if}
			</div></StarshipPreview
		>
		{#if starshipMode}
			<PortalPreview
				onClick={async () => {
					exit();
					void toggleStarshipMode();
					await wait();
					await wait(); // TODO idk
					void toggleStarshipMode();
				}}
				><div style="font-size: 84px;">↻</div>
				<div class="button-text">restart</div></PortalPreview
			>{/if}
	</div>
	{#if resetScores || importScores}
		<div transition:scale|local>
			<Panel>
				<div class="markup">
					<h2>scores</h2>
					{#if scores}
						<br />
						<StarshipStageScore {scores} defaultIcon="❔" />
						<br />
						<p class="centered">
							{#if scores.crewRescuedAtOnceCount >= 5}
								<a href="/unlock">full crew ready</a>
							{:else if scores.crewRescuedAtOnceCount}
								{scores.crewRescuedAtOnceCount} crewmember{#if scores.crewRescuedAtOnceCount !== 1}s{/if}
								rescued in your best run
							{:else}
								no crewmembers have been rescued
							{/if}
						</p>
					{/if}
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
	<AppControlsTable {clock}
		><tr><td><code>Space</code></td><td>toggle starship game</td></tr></AppControlsTable
	>
</div>

<style>
	.wrapper {
		padding: 0 var(--spacing_sm);
	}
	h2 {
		text-align: center;
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
	.button-text {
		font-size: var(--font_size_xl3);
		font-weight: 300;
	}
</style>
