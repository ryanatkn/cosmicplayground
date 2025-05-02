<script lang="ts">
	import {portals_context} from '$lib/portals.js';

	interface Props {
		slug: string;
	}

	let { slug }: Props = $props();

	const portals = portals_context.get();
	let portal = $derived($portals.data.portals_by_slug.get(slug)!);
</script>

<a href="/{slug}">
	{portal.name}
</a>

<style>
	a {
		background-color: hsl(var(--hue_d) 70% 58% / 18%);
		padding: 0 8px;
		border-radius: 5px;
		color: var(--color_d_5);
		font-weight: bold;
		border: var(--border_width_3) solid transparent;
		text-shadow: var(--text_shadow_sm);
	}
	a:hover {
		border-color: var(--space_color);
		border-style: var(--clickable_border_style_hover);
	}
	a:active {
		border-color: var(--space_text_color);
		border-style: var(--clickable_border_style_active);
	}
</style>
