<script lang="ts">
	import GalaxyBg from './GalaxyBg.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;

	portal;

	const clock = getClock();
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
		font-weight: 300;
		margin-bottom: 10px;
		position: absolute;
		z-index: 1;
		color: var(--space_text_color);
		color: #000;
		text-shadow: -1px 1px 0 var(--space_text_color), 1px 1px 0 var(--space_color);
	}
	.starlit {
		text-shadow: 1px -1px 0 var(--space_text_color), -1px -1px 0 var(--space_color);
	}
</style>
