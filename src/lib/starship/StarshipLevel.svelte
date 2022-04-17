<script lang="ts">
	import type {LevelData} from '$lib/starship/levels';
	import {playSong} from '$lib/music/playSong';
	import {playingAudio} from '$lib/audio/playAudio';

	export let level: LevelData;

	// TODO the `playingAudio` usage isn't reactive
	// maybe use a `mutable` map?
</script>

<div class="starship-level buttonish">
	<button
		on:click={() => {
			void playSong(level.song);
		}}
		class:selected={playingAudio(level.song.url)}
	>
		<div class="title">{level.title}</div>
	</button>
</div>

<style>
	.starship-level {
		margin: 0 var(--spacing_xs3);
	}
	.starship-level:first-child {
		margin-left: 0;
	}
	.starship-level:last-child {
		margin-right: 0;
	}
	button {
		position: relative;
		padding: var(--spacing_xs3) var(--spacing_xs);
	}
	.title {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font_size_lg);
		text-align: center;
		text-shadow: 2px 2px 3px #000;
	}
	@media (max-width: 1100px) {
		.title {
			font-size: var(--font_size_md);
		}
	}
	.selected {
		color: var(--pending_color);
		border-color: var(--pending_color);
	}
</style>
