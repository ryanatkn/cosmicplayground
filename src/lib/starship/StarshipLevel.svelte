<script lang="ts">
	import type {LevelData} from '$lib/starship/levels';
	import {playSong} from '$lib/music/playSong';

	export let level: LevelData;
</script>

<div class="starship-level buttonish">
	<button
		on:click={() => {
			void playSong(level.song);
			console.log(`level`, level);
		}}
	>
		<div class="title">{level.title}</div>
	</button>
</div>

<style>
	.starship-level {
		margin: 0 var(--spacing_xs);
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
</style>
