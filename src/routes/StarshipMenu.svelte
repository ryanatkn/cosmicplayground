<script lang="ts">
	import {scale} from 'svelte/transition';
	import {wait} from '@grogarden/util/async.js';
	import type {ClockStore} from '$lib/flat/clock.js';

	import Panel from '$lib/app/Panel.svelte';
	import StarshipPreview from '$routes/Preview.svelte';
	import StarshipStageScore from '$routes/StarshipStageScore.svelte';
	import type {StarshipStageScores} from '$routes/starshipStage';
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
	<div class="box starship_preview_wrapper">
		<Panel>
			<div class="starship_preview">
				<StarshipPreview
					onClick={async () => {
						exit();
						await toggleStarshipMode();
					}}
					{starshipMode}
				>
					<div class="button-text">
						{#if starshipMode}exit{:else}play{/if}
					</div>
					<small><code>[Space]</code></small>
				</StarshipPreview>
				{#if starshipMode}
					<PortalPreview
						onClick={async () => {
							exit();
							void toggleStarshipMode();
							await wait();
							await wait(); // TODO idk
							void toggleStarshipMode();
						}}
					>
						<div style="font-size: 84px;">↻</div>
						<div class="button-text">restart</div>
						<small><code>[r]</code></small>
					</PortalPreview>{/if}
			</div>
		</Panel>
	</div>
	{#if resetScores || importScores}
		<div transition:scale|local>
			<Panel>
				<div>
					<h2>scores</h2>
					{#if scores}
						<br />
						<StarshipStageScore {scores} defaultIcon="❔" />
						<br />
						<p class="box spaced">
							{#if scores.crew_rescued_at_once_count >= 5}
								<a href="/unlock">full crew ready</a>
							{:else if scores.crew_rescued_at_once_count}
								{scores.crew_rescued_at_once_count} crewmember{#if scores.crew_rescued_at_once_count !== 1}s{/if}
								rescued in your best run
							{:else}
								no crewmembers have been rescued
							{/if}
						</p>
					{/if}
					<div class="box row">
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
	<AppControlsTable {clock}>
		<tr><td><code>[Space]</code></td><td>toggle starship game</td></tr>
		<tr><td><code>[r]</code></td><td>restart starship game</td></tr>
	</AppControlsTable>
</div>

<style>
	.wrapper {
		padding: 0 var(--spacing_sm);
	}
	h2 {
		text-align: center;
	}
	.starship_preview {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* TODO hacky */
	.starship_preview :global(.portal_preview) {
		margin: 0;
	}
	/* TODO hacky */
	.starship_preview_wrapper :global(> .panel) {
		margin-top: 0;
		margin-bottom: 0;
	}
	.button-text {
		font-size: var(--size_3);
		font-weight: 300;
	}
	small {
		margin: var(--spacing_sm) 0;
	}
</style>
