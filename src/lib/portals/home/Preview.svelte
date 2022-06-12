<script lang="ts">
	import PortalPreview from '$lib/app/PortalPreview.svelte';

	export let onClick: ((e: MouseEvent) => void) | null = null; // one of `href` and `onClick` is required
	export let classes: string | undefined = undefined;
	export let starshipMode = false;

	$: finalClasses = starshipMode ? classes : (classes || '') + ' portal-preview--starship';
</script>

<PortalPreview style="font-size: 84px;" classes={finalClasses} {...$$restProps} {onClick}
	>🛸<slot /></PortalPreview
>
