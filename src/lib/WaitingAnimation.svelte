<script lang="ts">
	import type {Async_Status} from '@ryanatkn/belt/async.js';
	import Pending_Animation from '@ryanatkn/fuz/Pending_Animation.svelte';

	interface Props {
		status?: Async_Status; // 'initial' is unhandled
	}

	let { status = 'pending' }: Props = $props();

	let success = $derived(status === 'success');
	let failure = $derived(status === 'failure');
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
