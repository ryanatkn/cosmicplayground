<script lang="ts">
	import {seed} from '$lib/dealt/util/random';

	const randomizeSeed = (): void => {
		$seed = [Math.random()];
	};
</script>

<button on:click={randomizeSeed}><div class="clickable">🔮</div></button>

<style>
	button {
		font-size: var(--icon_size_xl);
	}
</style>
