<script lang="ts">
	import {goto} from '$app/navigation';
	import {swallow} from '@grogarden/util/dom.js';
	import {enableGlobalHotkeys} from '@ryanatkn/dealt';

	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';

	const onKeydown = async (e: KeyboardEvent) => {
		if (e.key === 'Escape' && e.ctrlKey && enableGlobalHotkeys(e.target)) {
			swallow(e);
			await goto('/');
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<a href="/" class="idle-fade">
	<FloatingIconButton label="go back home">⇦</FloatingIconButton>
</a>

<style>
	/* TODO refactor this out */
	a:hover {
		text-decoration: none;
	}
</style>
