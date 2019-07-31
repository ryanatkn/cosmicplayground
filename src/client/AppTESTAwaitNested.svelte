<script lang="ts">
	export let name: string | undefined;
	const promise1 = new Promise(resolve => resolve('success1'));
	const promise2 = new Promise(resolve => resolve('success2'));
	const promise3 = new Promise(resolve => resolve('success3'));
</script>

{#await promise1}
	pending1
{:then value1}
	{value1}
	{#await promise2}
		pending2{value1}
	{:then value2}
		{value2}{value1}
		{#await promise3}
			pending3{value1}{value2}
		{:then value3}
			{value3}{value1}{value2}
		{:catch err3}
			{err3}{value1}{value2}
		{/await}
	{:catch err2}
		{err2} {value1}
	{/await}
{:catch err1}
	{err1}
{/await}
