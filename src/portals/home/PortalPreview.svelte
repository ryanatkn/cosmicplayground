<script>
	export let href = null; // one of `href` and `onClick` is required
	export let onClick = null; // one of `href` and `onClick` is required
	export let classes = '';
	export let style = null;

	// This check and the whole component are both a bit weird,
	// not sure of a better way to share styles and behaviors.
	if (href && onClick) {
		throw Error(`PortalPreview was given both "href" and "onClick" props. Only one is supported.`);
	}
</script>

{#if href}
	<!-- TODO remove this interpolated class, or at least clean it up (needs sy rollup plugin fix) -->
	<a class="portal-preview {classes}" {href} {style}>
		<slot />
	</a>
{:else}
	<button class="portal-preview {classes}" on:click={onClick} {style} type="button">
		<slot />
	</button>
{/if}

<style>
	.portal-preview {
		cursor: default;
		background: transparent;
		border: var(--portal_border);
		border-radius: var(--portal_border_radius);
		margin: 12px;
		text-align: center;
		color: var(--text_color);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: var(--clickable_transition);
		transform: scale3d(1, 1, 1);
	}
	.portal-preview:hover,
	.portal-preview:focus {
		border-style: var(--clickable_border_style__hover);
		transform: var(--clickable_transform_sm__hover);
	}
	.portal-preview:active {
		border-style: var(--clickable_border_style__active);
		transform: var(--clickable_transform_sm__active);
	}
</style>
