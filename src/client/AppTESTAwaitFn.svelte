<script lang="ts">
	export let name: string | undefined;
	const getPromise = () => new Promise(resolve => resolve('success'));
</script>

{#await getPromise() then value}{value}{/await}
