<script>
	import {AsyncState} from '@feltcoop/gro/dist/utils/async.js';

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
				title={resource.status === AsyncState.Failure ? 'click to reload' : resource.status === AsyncState.Success ? 'resource loaded' : 'resource loading'}
			/>
		{/each}
	</div>
</div>

<style>
	h2 {
		font-weight: 100;
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
		box-shadow: 2px 4px 10px 2px rgba(0, 0, 0, 0.4) inset, 1px 2px 2px rgba(0, 0, 0, 0.4) inset;
		border: 1px solid #000;
	}
	.pending {
		background-color: yellow;
	}
	.failure {
		background-color: red;
		cursor: pointer;
	}
	.success {
		background-color: green;
	}
</style>
