<script lang="ts">
	export let name: string;
	export let num: number = 1;
</script>

<script context="module" lang="ts">
	// this is out of order on purpose
	const numInModuleContexts = 2;
</script>

<div>{num} {numInModuleContext}</div>
