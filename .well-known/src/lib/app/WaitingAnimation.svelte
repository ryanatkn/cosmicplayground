<script lang="ts">
	import type {Async_Status} from '@grogarden/util/async.js';
	import Pending_Animation from '@fuz.dev/fuz_library/Pending_Animation.svelte';

	export let status: Async_Status = 'pending'; // 'initial' is unhandled

	$: success = status === 'success';
	$: failure = status === 'failure';
</script>

<span class:success class:failure>
	<Pending_Animation running={status === 'pending'} />
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
