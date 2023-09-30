<script lang="ts">
	import {get_clock} from '$lib/dealt/flat/clock.js';

	import GalaxyBg from '$routes/starlit-hammock/GalaxyBg.svelte';

	const clock = get_clock();
</script>

<div><span class="starlit">starlit</span> hammock</div>
<GalaxyBg
	width={260}
	height={200}
	opacity={0.6}
	animationDuration="180s"
	running={$clock.running}
/>

<style>
	div {
		font-size: 48px;
		font-weight: 500;
		margin-bottom: 10px;
		position: absolute;
		z-index: 1;
		color: var(--space_text_color);
		color: var(--space_color);
		text-shadow: 1px 1px 0 var(--space_text_color);
	}
	.starlit {
		text-shadow: 1px -1px 0 var(--space_text_color);
	}
</style>
