<script lang="ts">
	import {getClock} from '@ryanatkn/dealt';

	import FreqSpeeds from '$routes/freq-speeds/FreqSpeeds.svelte';
	import FreqSpectacle from '$routes/freq-spectacle/FreqSpectacle.svelte';

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
	}
	.item {
		display: flex;
	}
	.item:first-child {
		transform: rotate(180deg);
	}
</style>
