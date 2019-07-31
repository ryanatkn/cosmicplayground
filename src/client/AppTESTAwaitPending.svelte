<script lang="ts">
	export let name: string | undefined;
	const promise = new Promise(resolve => resolve('success'));
</script>

{#await promise}pending{:then value}{value}{/await}
