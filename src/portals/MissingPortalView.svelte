<script>
	import Panel from '../app/Panel.svelte';

	export let portal;
</script>

<!-- TODO how to handle this? -->
<section class="view">
	<Panel>
		<h2>unknown portal: {portal.slug}</h2>
	</Panel>
</section>
