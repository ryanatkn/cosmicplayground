<script lang="ts">
	import AppTESTChild1 from './AppTESTChild1.svelte';
	import AppTESTChild2 from './AppTESTChild2.svelte';
	import {
		usedImportInScript,
		usedImportInMarkup,
		unusedImport,
	} from './AppTESTRegularCode';
	export let num: number = 1;
	console.log('used import in script', usedImportInScript());
</script>

<div class="foo">
	App({num})
	<AppTESTChild1 childOneNum={1} />
	<AppTESTChild2 childTwoNum={'2'} />
	("{usedImportInMarkup()}")
</div>

<style>
	.foo {
		color: red;
	}
</style>
