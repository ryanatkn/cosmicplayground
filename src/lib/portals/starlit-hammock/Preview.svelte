<script lang="ts">
	import GalaxyBg from './GalaxyBg.svelte';
	import {getClock} from '$lib/app/clockStore';
	import {type PortalData} from '$lib/portals/portal';

	export let portal: PortalData;

	portal;

	const clock = getClock();
</script>

<span>starlit hammock</span>
<GalaxyBg
	width={260}
	height={200}
	opacity={0.6}
	animationDuration="180s"
	running={$clock.running}
/>

<style>
	span {
		font-size: 48px;
		font-weight: 100;
		margin-bottom: 10px;
		position: absolute;
		z-index: 1;
		color: var(--space_text_color);
		text-shadow: 0 0 10px var(--space_text_color), 0 0 3px var(--space_text_color);
	}
</style>
