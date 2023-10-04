<script lang="ts">
	import PortalPreview from '$lib/app/PortalPreview.svelte';

	export let on_click: ((e: MouseEvent) => void) | null = null; // one of `href` and `on_click` is required
	export let classes: string | undefined = undefined;
	export let starshipMode = false;

	$: finalClasses = starshipMode ? classes : (classes || '') + ' portal_preview--starship';
</script>

<PortalPreview style="font-size: 84px;" classes={finalClasses} {...$$restProps} {on_click}
	>🛸<slot /></PortalPreview
>
