<script lang="ts">
	import FreqSpeeds from '$lib/portals/freq-speeds/FreqSpeeds.svelte';
	import FreqSpectacle from '$lib/portals/freq-spectacle/FreqSpectacle.svelte';

	import {getClock} from '$lib/app/clock';

	const clock = getClock();

	const TIME_DILATION = 2;
</script>

<div class="preview">
	<div class="item">
		<FreqSpeeds
			elapsedTime={$clock.time / TIME_DILATION}
			width={131}
			height={16}
			hzItems={[3]}
			lowestHzValue={500}
			lowestHzItemCount={2}
		/>
	</div>
	<FreqSpectacle
		elapsedTime={$clock.time / (TIME_DILATION * 2)}
		width={131}
		height={16}
		hzItems={[3]}
		lowestHzValue={500}
		lowestHzItemCount={2}
	/>
</div>

<style>
	.preview {
		display: flex;
		padding: var(--portal_padding);
	}
	.item {
		display: flex;
	}
	.item:first-child {
		transform: rotate(180deg);
	}
</style>
