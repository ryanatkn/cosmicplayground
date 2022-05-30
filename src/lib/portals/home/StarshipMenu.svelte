<script lang="ts">
	import Panel from '$lib/app/Panel.svelte';

	export let exit: () => void;
</script>

<Panel>
	<div class="markup">
		<h1>?????</h1>
		<button on:click={() => exit()}>exit</button>
	</div>
</Panel>
