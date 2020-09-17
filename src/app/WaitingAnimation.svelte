<script>
	import {AsyncState} from '@feltcoop/gro/dist/utils/async.js';

	export let status = AsyncState.Pending; // Initial is unhandled

	$: success = status === AsyncState.Success;
	$: failure = status === AsyncState.Failure;
</script>

<span class:success class:failure>
	<span class="dot">•</span>
	<span class="dot">•</span>
	<span class="dot">•</span>
</span>

<style>
	.dot {
		opacity: 0;
		animation: dot var(--waiting_animation_duration) infinite;
		color: var(--pending_color);
	}
	.success .dot {
		opacity: 1;
		animation: none;
		color: var(--success_color);
	}
	.failure .dot {
		opacity: 1;
		animation: none;
		color: var(--failure_color);
	}

	.dot:nth-child(1) {
		animation-delay: 0s;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes dot {
		0% {
			opacity: 0;
		}
		33% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
