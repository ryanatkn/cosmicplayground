<script lang="ts">
	import {goto} from '$app/navigation';

	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';
	import {enableGlobalHotkeys} from '$lib/util/dom';

	const onKeydown = async (e: KeyboardEvent) => {
		if (e.key === 'Escape' && enableGlobalHotkeys(e.target)) {
			e.stopPropagation();
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
