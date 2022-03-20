<script lang="ts">
	import WaitingAnimation from '$lib/app/WaitingAnimation.svelte';
	import type {AsyncStatus} from '@feltcoop/felt';

	export let status: AsyncStatus;
</script>

<div class="waiting-screen fade-in">
	<WaitingAnimation {status} />
</div>

<style>
	.waiting-screen {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font_size_xl);
		/* This waits one cycle of animation so it doesn't flash when load is quick.
		The animation-fill-mode property is needed to set the initial opacity to 0
		without making it go back to 0 when the fade in animation completes. */
		animation-delay: var(--waiting_animation_duration);
		animation-fill-mode: forwards;
		opacity: 0;
	}
</style>
