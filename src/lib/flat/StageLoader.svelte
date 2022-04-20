<script lang="ts">
	import {onMount} from 'svelte';

	import {Stage} from '$lib/portals/home/starshipStage';
	import {Controller} from '$lib/flat/Controller';

	export const stage: Stage = new Stage(new Controller()); // TODO default controller?
	export let setup: () => Promise<void>;

	let ready = false;
	onMount(async () => {
		await setup();
		ready = true;
		return async () => {
			await stage.teardown();
		};
	});
</script>

{#if ready}
	<slot {stage} />
{/if}
