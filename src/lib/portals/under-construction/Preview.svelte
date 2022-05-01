<script lang="ts">
	import {getClock} from '$lib/app/clock';

	const clock = getClock();
</script>

<img
	src={$clock.running
		? '/assets/construction/person-dig-idea.gif'
		: '/assets/construction/person-dig-idea.gif'}
	alt="under construction: person rock"
	style="width: 96px; height: 96px;"
	class="pixelated"
/>

<style>
	img {
		animation: rotate-pulse 10s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
	}
	:global(.paused) img {
		animation-play-state: paused;
	}
	@keyframes rotate-pulse {
		0% {
			transform: rotate3d(-0.51, 0.49, 0.19, 27deg) scale3d(0.65, 0.65, 0.65);
		}
		66% {
			transform: rotate3d(0.65, 0.06, -0.07, 40deg) scale3d(1.42, 1.42, 1.42);
		}
		100% {
			transform: rotate3d(-0.51, 0.49, 0.19, 27deg) scale3d(0.65, 0.65, 0.65);
		}
	}
</style>
