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
		border: var(--border_width_sm) solid transparent;
		text-shadow: var(--text_shadow_sm);
		white-space: nowrap;
	}
	a:hover {
		border-color: var(--space_color);
		border-style: var(--clickable_border_style__hover);
	}
	a:active {
		border-style: var(--clickable_border_style__active);
	}
</style>
