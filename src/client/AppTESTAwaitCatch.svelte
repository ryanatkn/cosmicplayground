<script lang="ts">
	export let name: string | undefined;
	const promise = new Promise((_, reject) => reject('success'));
</script>

{#await promise}pending{:then value}{value}{:catch err}{err}{/await}
