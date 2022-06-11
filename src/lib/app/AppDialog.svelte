<script lang="ts">
	import Dialog from '@feltcoop/felt/ui/dialog/Dialog.svelte';

	export let exit: () => void;
</script>

<Dialog
	on:close={() => {
		exit();
	}}><slot {exit} /></Dialog
>
