<script lang="ts">
	import type {Volume} from '$lib/audio_helpers.js';

	interface Props {
		volume: Volume;
		muted: boolean;
		onvolume: (volume: Volume) => void;
		onmute: (muted: boolean) => void;
	}

	let {volume = $bindable(1), muted = $bindable(false), onvolume, onmute}: Props = $props();
</script>

<label class:muted title="volume">
	{#if muted}
		<button
			type="button"
			class="icon_button plain"
			onclick={() => {
				muted = !muted;
				onmute(muted);
			}}
		>
			{#if muted}🔇{:else if volume < 0.33}🔉{:else}🔊{/if}
		</button>
	{/if}
	<small>{Math.round(volume * 100)}<span>%</span></small>
	<input
		class="plain"
		type="range"
		oninput={(e) => {
			volume = Number(e.currentTarget.value);
			onvolume(volume);
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
