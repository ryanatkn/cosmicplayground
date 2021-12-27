<script>
	import {AsyncState} from '@feltcoop/gro/dist/utils/async.js';
	import WaitingAnimation from './WaitingAnimation.svelte';

	export let resources;

	// TODO improve styling
	// TODO allow clicking each to retry the request (`resourcesStore` needs an API for that)
</script>

<div class="resources-loading-progress">
	<h2>{Math.round($resources.progress * 100)}%</h2>
	<div class="resources">
		{#each $resources.resources as resource (resource.url)}
			<div
				class="resource"
				class:success={resource.status === AsyncState.Success}
				class:pending={resource.status === AsyncState.Pending}
				class:failure={resource.status === AsyncState.Failure}
				on:click={() => {
					if (resource.status === AsyncState.Failure) {
						window.location.reload();
					}
				}}
				title={resource.status === AsyncState.Failure
					? 'click to reload'
					: resource.status === AsyncState.Success
					? 'resource loaded'
					: 'resource loading'}
			/>
		{/each}
	</div>
	<div class="waiting-animation-wrapper">
		<WaitingAnimation status={$resources.status} />
	</div>
</div>

<style>
	h2 {
		margin-bottom: 10px;
		font-size: var(--font_size_lg);
	}
	.resources-loading-progress {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.resources {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
	.resource {
		width: 48px;
		height: 48px;
		border-radius: 11px;
		margin: 0 2px;
	}
	.pending {
		background-color: var(--pending_color);
	}
	.failure {
		background-color: var(--failure_color);
		cursor: pointer;
	}
	.success {
		background-color: var(--success_color);
	}
	.waiting-animation-wrapper {
		font-size: var(--font_size_xl);
	}
</style>
