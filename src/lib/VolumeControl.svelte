<script lang="ts">
	import type {Writable} from 'svelte/store';

	import type {Volume} from '$lib/helpers';

	// TODO maybe events instead of writable stores?
	export let volume: Writable<Volume>;
	export let muted: Writable<boolean> | null = null;

	$: text = muted ? ($muted ? '🔇' : '🔊') : null;
</script>

<label>
	{#if muted}
		<button class="icon-button plain-button" on:click={() => ($muted = !$muted)}>{text}</button>
	{/if}
	<input
		class="plain-input"
		type="number"
		on:input={(e) => ($volume = Number(e.currentTarget.value))}
		step={0.01}
		min={0}
		max={1}
		value={$volume}
	/>
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
	input[type='number'] {
		width: 100px;
	}
</style>
