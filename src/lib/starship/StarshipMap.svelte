<script lang="ts">
	import {toStageDataByName} from '$lib/starship/levels';
	import StarshipStage from '$lib/starship/StarshipStage.svelte';
	import StarshipLevel from '$lib/starship/StarshipLevel.svelte';
</script>

<div class="levels">
	<section>
		<StarshipStage stage={toStageDataByName('0')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('1')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('2')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('3')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<!-- TODO only 4c from 4b -->
		<StarshipStage stage={toStageDataByName('4')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('5')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('6')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('7')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('8')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('9')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<!-- TODO only 10c from 10b -->
		<StarshipStage stage={toStageDataByName('10')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<StarshipStage stage={toStageDataByName('11')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
	<section>
		<!-- TODO only 12c from 12a -->
		<StarshipStage stage={toStageDataByName('12')} let:level>
			<StarshipLevel {level} />
		</StarshipStage>
	</section>
</div>

<style>
	.levels {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	section {
		display: flex;
	}
</style>
