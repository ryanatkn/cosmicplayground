<script lang="ts">
	import type {ResourcesStore} from '$lib/resources.js';
	import WaitingAnimation from '$lib/WaitingAnimation.svelte';

	interface Props {
		resources: ResourcesStore; // TODO improve styling
	}

	let { resources }: Props = $props();

	
	// TODO allow clicking each to retry the request (`resourcesStore` needs an API for that)
</script>

<div class="resources-loading-progress">
	<h2>{Math.round($resources.progress * 100)}%</h2>
	<div class="resources">
		{#each $resources.resources as resource (resource.url)}
			<div
				class="resource"
				class:success={resource.status === 'success'}
				class:pending={resource.status === 'pending'}
				class:failure={resource.status === 'failure'}
				onclick={() => {
					if (resource.status === 'failure') {
						window.location.reload();
					}
				}}
				aria-hidden="true"
				title={resource.status === 'failure'
					? 'click to reload'
					: resource.status === 'success'
						? 'resource loaded'
						: 'resource loading'}
			></div>
		{/each}
	</div>
	<div class="waiting-animation-wrapper">
		<WaitingAnimation status={$resources.status} />
	</div>
</div>

<style>
	h2 {
		margin-bottom: 10px;
		font-size: var(--size_xl4);
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
		background-color: var(--error_color);
		cursor: pointer;
	}
	.success {
		background-color: var(--success_color);
	}
	.waiting-animation-wrapper {
		font-size: var(--size_xl5);
	}
</style>
