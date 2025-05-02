<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let {children}: Props = $props();
</script>

<!-- TODO what if any components anywhere could register hud components?
	Seems weird to conditionally render the hud and let child components mount one when needed.
	Sounds like React's "portal" concept. (different from cosmicplayground's "portals"!!)
	Alternatively, we could have the hud take a prop to position it to the left/right/top/bottom,
	but then multiple huds could overlap, which could be easily avoided with a single hud.
-->
<div class="hud idle_fade">
	{@render children?.()}
</div>

<style>
	.hud {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10;
		/* TODO do we want these flex properties or stick with regular block and let children do whatever */
		display: flex;
		flex-direction: column;
	}
</style>
