<script lang="ts">
	import PortalPreview from '$lib/PortalPreview.svelte';

	interface Props {
		on_click?: ((e: MouseEvent) => void) | null; // one of `href` and `on_click` is required
		classes?: string | undefined;
		starshipMode?: boolean;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		on_click = null,
		classes = undefined,
		starshipMode = false,
		children,
		...rest
	}: Props = $props();

	let finalClasses = $derived(
		starshipMode ? classes : (classes || '') + ' portal_preview--starship',
	);
</script>

<PortalPreview style="font-size: 84px;" classes={finalClasses} {...rest} {on_click}
	>🛸{@render children?.()}</PortalPreview
>
