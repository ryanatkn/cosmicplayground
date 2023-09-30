<script lang="ts">
	import type {AsyncStatus} from '@grogarden/util/async.js';
	import PendingAnimation from '@fuz.dev/fuz_library/PendingAnimation.svelte';

	export let status: AsyncStatus = 'pending'; // 'initial' is unhandled

	$: success = status === 'success';
	$: failure = status === 'failure';
</script>

<span class:success class:failure>
	<PendingAnimation running={status === 'pending'} />
</span>

<style>
	span {
		color: var(--pending_color);
	}
	.success {
		color: var(--success_color);
	}
	.failure {
		color: var(--error_color);
	}
</style>
