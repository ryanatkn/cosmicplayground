<script lang="ts">
	import {goto} from '$app/navigation';

	import FloatingIconButton from '$lib/app/FloatingIconButton.svelte';

	const onKeydown = async (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.stopPropagation();
			e.preventDefault();
			await goto('/');
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

<a href="/" class="idle-fade">
	<FloatingIconButton label="go back home">⇦</FloatingIconButton>
</a>
