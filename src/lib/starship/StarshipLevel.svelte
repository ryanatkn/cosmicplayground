<script lang="ts">
	import type {LevelData} from '$lib/starship/levels';

	export let level: LevelData;
</script>

<div class="starship-level buttonish">
	<button
		on:click={() => {
			console.log(`level`, level);
		}}
	>
		<div class="title">{level.title}</div>
	</button>
</div>

<style>
	button {
		position: relative;
		padding: var(--spacing_sm) var(--spacing_xs);
	}
	.title {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font_size_lg);
		text-align: center;
		font-weight: 300;
		text-shadow: 2px 2px 3px #000;
	}
	@media (max-width: 1100px) {
		.title {
			font-size: var(--font_size_md);
		}
	}
</style>
