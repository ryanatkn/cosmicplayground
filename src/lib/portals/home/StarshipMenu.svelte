<script lang="ts">
	import LinkPath from '@feltcoop/felt/ui/LinkPath.svelte';

	import Panel from '$lib/app/Panel.svelte';

	export let exit: () => void;
</script>

<Panel>
	<div class="markup">
		<LinkPath>🌠</LinkPath>
		<h1>?????</h1>
		<button on:click={() => exit()}>exit</button>
	</div>
</Panel>
