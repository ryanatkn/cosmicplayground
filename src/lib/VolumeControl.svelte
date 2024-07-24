<script lang="ts">
	import {createEventDispatcher} from 'svelte';

	import type {Volume} from '$lib/audio_helpers';

	const dispatch = createEventDispatcher<{
		volume: number;
		muted: boolean;
	}>();

	// TODO maybe events instead of writable stores?
	export let volume: Volume = 1;
	export let muted = false;
</script>

<label class:muted title="volume">
	{#if muted}
		<button
			class="icon_button plain"
			on:click={() => {
				muted = !muted;
				dispatch('muted', muted);
			}}
		>
			{#if muted}🔇{:else if volume < 0.33}🔉{:else}🔊{/if}
		</button>
	{/if}
	<small>{Math.round(volume * 100)}<span>%</span></small>
	<input
		class="plain"
		type="range"
		on:input={(e) => {
			volume = Number(e.currentTarget.value);
			dispatch('volume', volume);
		}}
		step={0.01}
		min={0}
		max={1}
		value={volume}
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
		color: var(--text_color_3);
	}
</style>
