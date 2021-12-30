<script lang="ts">
	import {getPortals, findPortalBySlug} from '$lib/app/portalsStore';

	export let slug: string;

	const portals = getPortals();
	$: portal = findPortalBySlug($portals.data, slug);
</script>

<a href="/{slug}">
	{portal.name}
</a>

<style>
	a {
		background-color: var(--bg_3);
		padding: 0 8px;
		border-radius: 5px;
		color: var(--color_3);
		font-weight: bold;
		border: var(--border_width_md) solid transparent;
		text-shadow: var(--text_shadow_sm);
		white-space: nowrap;
	}
	a:hover {
		border-color: var(--space_color);
		border-style: var(--clickable_border_style__hover);
		text-decoration: none !important;
	}
	a:active {
		border-color: var(--space_text_color);
		border-style: var(--clickable_border_style__active);
	}
</style>
