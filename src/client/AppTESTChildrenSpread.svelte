<script lang="ts">
	import AppTESTChild1 from './AppTESTChild1.svelte';
	const a = 'astr';
	const childProps1 = {childOneNum: '1', childOneStr: 'y'};
	const childProps2 = {childOneNum: 2, childOneStrToo: 'misspelled prop'};
</script>

<AppTESTChild1 {a} {...childProps1} {...childProps2} />
