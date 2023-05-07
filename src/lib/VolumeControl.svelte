<script lang="ts">
	import type {Writable} from 'svelte/store';

	import type {Volume} from '$lib/helpers';

	// TODO maybe events instead of writable stores?
	export let volume: Writable<Volume>;
	export let muted: Writable<boolean> | null = null;

	$: text = muted ? ($muted ? '🔇' : '🔊') : null;
</script>

<label class:muted={$muted}>
	{#if muted}
		<button class="icon-button plain-button" on:click={() => ($muted = !$muted)}>{text}</button>
	{/if}
	<small>{Math.round($volume * 100)}<span>%</span></small>
	<input
		class="plain-input"
		type="range"
		on:input={(e) => ($volume = Number(e.currentTarget.value))}
		step={0.01}
		min={0}
		max={1}
		value={$volume}
	/>
</label>

<style>
	label {
		flex-direction: row;
	}
	small {
		width: 60px;
		text-align: center;
	}
	.muted small {
		color: var(--text_color_light);
	}
</style>
