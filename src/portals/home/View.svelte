<script>
	import {get_portals} from '../../app/portalsStore.js';
	import PortalPreview from './PortalPreview.svelte';
	import {VOID_PORTAL_SLUG} from '../portal.js';

	export let portal;
	export const width = undefined;
	export const height = undefined;
	// TODO is there a better way to do this so we avoid the catch-22 unused/unknown warnings?
	// maybe we should remove props and move them to context?
	// or maybe a portal store, similar to Sapper's page store?
	// portal = {data, width, height}
	// {portalData, portalWidth, portalHeight} = portalStores()
	// what about a `showHomeButton` store taking null|false|true, so portals can override as needed

	const portals = get_portals();

	const COOLNESS_VISIBILITY_THRESHOLD = 3;
	const unlistedPortals = new Set([portal.slug, VOID_PORTAL_SLUG]);

	const sortOrderBySlug = new Map(
		[
			'about',
			'deep-breath',
			'starlit-hammock',
			'paint-freqs',
			'easings-2',
			'easings-1',
			'hearing-test',
			'under-construction',
			'freq-speeds',
			'transition-designer',
			'bundle-vision',
			'clocks',
			'freq-spectacle',
		].map((slug, i) => [slug, i]),
	);
	// TODO remove this in prod NODE_ENV, or consider generating a type with all of the portal slugs?
	// for (const slug of sortOrderBySlug.keys()) {
	// 	if (!$portals.data.portalsBySlug.has(slug)) {
	// 		throw Error(`Unknown portal slug "${slug}"`);
	// 	}
	// }
	const getSortOrderForSlug = (slug) => {
		const sortOrder = sortOrderBySlug.get(slug);
		// TODO nullish coalescing
		return sortOrder === undefined ? Infinity : sortOrder;
	};
	const sortPortals = (portals) => {
		portals.sort((a, b) => (getSortOrderForSlug(a.slug) > getSortOrderForSlug(b.slug) ? 1 : -1));
		return portals;
	};

	$: coolPortals = sortPortals(
		$portals.data.portals.filter(
			(p) =>
				!unlistedPortals.has(p.slug) &&
				p.coolness <= COOLNESS_VISIBILITY_THRESHOLD &&
				p.slug !== 'bundle-vision', // TODO temporarily disabling because it's too techy
		),
	);

	$: superCoolPortals = sortPortals(
		$portals.data.portals.filter(
			(p) => !unlistedPortals.has(p.slug) && p.coolness > COOLNESS_VISIBILITY_THRESHOLD,
		),
	);

	// TODO what's the best way to persist this? uiStore? data per portal?
	// this is just a TEMP HACK!
	let showMorePortals = window['TODO_showMorePortals'] || false; // toggle showing projects that are less cool but still cool
	$: {
		window['TODO_showMorePortals'] = showMorePortals;
	}
</script>

<nav class="portal-previews">
	<!-- TODO buttons or links? both? maybe just the show button should be a link? 
  https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
  -->
	{#each superCoolPortals as portal (portal.slug)}
		<PortalPreview href="#{portal.slug}" classes="portal-preview--{portal.slug}">
			<svelte:component this={portal.Preview} {portal} />
		</PortalPreview>
	{/each}
	<PortalPreview classes="show-more-button" onClick={() => (showMorePortals = !showMorePortals)}>
		<h2>
			show {#if showMorePortals}less{:else}more{/if}
		</h2>
		<div>
			<img
				src="/assets/earth/night_lights_1.png"
				alt="night lights of Africa, Europe, and the Middle East"
				style="width: 100px; height: 100px;"
				class="mr-2"
			/>
			<img
				src="/assets/earth/night_lights_2.png"
				alt="night lights of the Americas"
				style="width: 100px; height: 100px;"
				class="mr-2"
			/>
			<img
				src="/assets/earth/night_lights_3.png"
				alt="night lights of Asia and Australia"
				style="width: 100px; height: 100px;"
			/>
		</div>
	</PortalPreview>
</nav>
{#if showMorePortals}
	<!-- TODO should there be just a single nav instead?
    and fix the styling somehow with an inner wrapper? -->
	<nav class="portal-previews">
		{#each coolPortals as portal (portal.slug)}
			<PortalPreview href="#{portal.slug}" classes="portal-preview--{portal.slug}">
				<svelte:component this={portal.Preview} {portal} />
			</PortalPreview>
		{/each}
	</nav>
{/if}

<style>
	.portal-previews {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		width: 100%; /* allows nesting without shared rows to let the toggle stay still */
	}

	:global(.show-more-button) {
		padding: var(--portal_padding);
	}

	/* TODO how to do this? data with a css variable?
	or is this the right time to add CSS variables to JS? */
	:global(.portal-preview--deep-breath) {
		border-color: var(--ocean_color) !important;
	}
	:global(.portal-preview--starlit-hammock) {
		border-color: var(--space_color) !important;
	}
</style>
