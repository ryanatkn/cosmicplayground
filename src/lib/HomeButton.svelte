<script lang="ts">
	import {goto} from '$app/navigation';
	import {swallow} from '@ryanatkn/belt/dom.js';
	import {enable_global_hotkeys} from '$lib/dom.js';

	import FloatingIconButton from '$lib/FloatingIconButton.svelte';

	const onKeydown = async (e: KeyboardEvent) => {
		if (e.key === 'Escape' && e.ctrlKey && enable_global_hotkeys(e.target)) {
			swallow(e);
			await goto('/');
		}
	};
</script>

<svelte:window onkeydown={onKeydown} />

<a href="/" class="idle_fade">
	<FloatingIconButton label="go back home">⇦</FloatingIconButton>
</a>

<style>
	/* TODO refactor this out */
	a:hover {
		text-decoration: none;
	}
</style>
