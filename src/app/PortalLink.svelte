<script>
	import {usePortals, findPortalBySlug} from './portalsStore.js';

	export let slug;

	const portals = usePortals();
	$: portal = findPortalBySlug($portals, slug);
</script>

<a href={`#${slug}`}>
	{portal.title}
	<!-- TODO I don't have a usecase for this yet,
		but a slot with default content might be nice:
		<slot {portal}>{portal.title}</slot>
	-->
</a>

<style>
	a {
		cursor: default;
		background-color: var(--bg_3);
		padding: 0 8px;
		border-radius: 5px;
		color: var(--color_3);
		font-weight: bold;
		border: 1px var(--clickable_border_style_sm) var(--space_color);
		text-shadow: var(--text_shadow_sm);
		white-space: nowrap;
	}
	a:hover {
		border-style: var(--clickable_border_style_sm__hover);
	}
	a:active {
		border-style: var(--clickable_border_style_sm__active);
	}
</style>
