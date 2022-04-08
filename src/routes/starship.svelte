<script lang="ts">
	import {toLevelData} from '$lib/starship/levels';
	import StarshipLevel from '$lib/starship/StarshipLevel.svelte';
</script>

<div class="starship">
	<div class="levels">
		<section>
			<StarshipLevel level={toLevelData('0a')} />
			<StarshipLevel level={toLevelData('0c')} />
			<StarshipLevel level={toLevelData('0b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('1a')} />
			<StarshipLevel level={toLevelData('1c')} />
			<StarshipLevel level={toLevelData('1b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('2a')} />
			<StarshipLevel level={toLevelData('2c')} />
			<StarshipLevel level={toLevelData('2b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('3a')} />
			<StarshipLevel level={toLevelData('3c')} />
			<StarshipLevel level={toLevelData('3b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('4a')} />
			<!-- TODO only from 4b -->
			<StarshipLevel level={toLevelData('4c')} />
			<StarshipLevel level={toLevelData('4b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('5a')} />
			<StarshipLevel level={toLevelData('5b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('6a')} />
			<StarshipLevel level={toLevelData('6c')} />
			<StarshipLevel level={toLevelData('6b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('7a')} />
			<StarshipLevel level={toLevelData('7c')} />
			<StarshipLevel level={toLevelData('7b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('8a')} />
			<StarshipLevel level={toLevelData('8c')} />
			<StarshipLevel level={toLevelData('8b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('9a')} />
			<StarshipLevel level={toLevelData('9c')} />
			<StarshipLevel level={toLevelData('9b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('10a')} />
			<!-- TODO only from 10b -->
			<StarshipLevel level={toLevelData('10c')} />
			<StarshipLevel level={toLevelData('10b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('11a')} />
			<StarshipLevel level={toLevelData('11b')} />
		</section>
		<section>
			<StarshipLevel level={toLevelData('12a')} />
			<!-- TODO only from 12a -->
			<StarshipLevel level={toLevelData('12c')} />
			<StarshipLevel level={toLevelData('12b')} />
		</section>
	</div>
</div>

<style>
	.starship {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.levels {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	section {
		display: flex;
	}
</style>
