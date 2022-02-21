<script lang="ts">
	import RadialLayout from '$lib/ui/RadialLayout.svelte';
	import {type StarshipStageScores} from '$lib/portals/home/starshipStage';

	export let scores: StarshipStageScores | undefined;

	export const faces = ['🐭', '🐶', '🐰', '🦊', '🐱'];
</script>

<div class="score">
	<div class="friends">
		<RadialLayout
			items={faces.slice(1)}
			totalCount={10}
			width={170}
			offset={(-1.6 * Math.PI) / 11}
			let:item
			let:index
		>
			<div class="friend" style:transform="translate3d({item.x}px, {item.y}px, 0)">
				{item.value}
				{#if scores && !scores.friends[index]}
					<div class="skull">💀</div>
				{/if}
			</div>
		</RadialLayout>
	</div>
	<div class="planet">
		{faces[0]}
		{#if scores && !scores.planet}
			<div class="skull">💀</div>
		{/if}
	</div>
</div>

<style>
	.score {
		user-select: none;
		position: absolute;
		left: 0;
		bottom: 0;
		text-align: center;
	}
	.friends {
		font-size: var(--font_size_xl);
		position: absolute;
		left: 150px;
		top: 150px;
		width: 0;
		height: 0;
	}
	.friend {
		font-size: var(--font_size_xl);
		position: absolute;
		left: 0;
		top: 0;
	}
	.planet {
		font-size: var(--font_size_xl3);
		width: 200px;
	}
	.skull {
		position: absolute;
		inset: 0;
		font-size: 90%;
	}
</style>
