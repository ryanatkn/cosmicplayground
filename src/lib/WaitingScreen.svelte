<script lang="ts">
	import type {Async_Status} from '@ryanatkn/belt/async.js';

	import WaitingAnimation from '$lib/WaitingAnimation.svelte';

	export let status: Async_Status;
</script>

<div class="waiting-screen">
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
		font-size: var(--size_xl5);
		/* This waits one cycle of animation so it doesn't flash when load is quick.
		The animation-fill-mode property is needed to set the initial opacity to 0
		without making it go back to 0 when the fade in animation completes. */
		animation-delay: var(--duration_5);
		animation-fill-mode: forwards;
		opacity: 0;
	}
</style>
