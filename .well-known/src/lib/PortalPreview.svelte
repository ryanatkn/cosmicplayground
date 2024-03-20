<script lang="ts">
	export let href: string | null = null; // one of `href` and `on_click` is required
	export let on_click: ((e: MouseEvent) => void) | null = null; // one of `href` and `on_click` is required
	export let classes = '';

	// TODO maybe change `on_click` to an event, but then we'd lose this check:
	// This check and the whole component are both a bit weird,
	// not sure of a better way to share styles and behaviors.
	if (href && on_click) {
		throw Error(`PortalPreview was given both "href" and "on_click" props. Only one is supported.`);
	}
	if (!href && !on_click) {
		throw Error(`PortalPreview requires either "href" or "on_click".`);
	}
</script>

{#if href}
	<!-- TODO remove this interpolated class, or at least clean it up (needs sy rollup plugin fix) -->
	<a class="portal_preview buttonish {classes}" {href} {...$$restProps}>
		<slot />
	</a>
{:else}
	<button class="portal_preview {classes}" on:click={on_click} type="button" {...$$restProps}>
		<slot />
	</button>
{/if}

<style>
	.portal_preview {
		background: transparent;
		border: var(--portal_border);
		border-radius: var(--portal_border_radius);
		margin: 12px;
		text-align: center;
		color: var(--text_color_dark);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-grow: 0;
		transition: var(--clickable_transition);
		text-decoration: none;
		transform: scale3d(1, 1, 1);
	}
	/* in other places we don't use :focus like this to duplicate the hover style,
	but here it works alright because the action navigates away -
	see `button:focus` in main.css for more */
	.portal_preview:hover,
	.portal_preview:focus {
		border-style: var(--clickable_border_style_hover);
		transform: var(--clickable_transform_sm_hover);
	}
	.portal_preview:active {
		border-style: var(--clickable_border_style_active);
		transform: var(--clickable_transform_sm_active);
	}
</style>
