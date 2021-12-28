<script lang="ts">
	import {browser} from '$app/env';

	import {getPortals} from '$lib/app/portalsStore';
	import PortalPreview from './PortalPreview.svelte';
	import {type PortalData} from '$lib/portals/portal';
	import homePortal from '$lib/portals/home/data';
	import aboutPortal from '$lib/portals/about/data';
	import voidPortal from '$lib/portals/void/data';

	const portals = getPortals();

	const COOLNESS_VISIBILITY_THRESHOLD = 3;
	const unlistedPortals = new Set([homePortal.name, aboutPortal.name, voidPortal.name]);

	// TODO shouldn't this be handled by coolness? or maybe just remove that altogether
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
			'clocks',
			'freq-spectacle',
		].map((slug, i) => [slug, i]),
	);
	const getSortOrderForSlug = (slug: string) => sortOrderBySlug.get(slug) ?? Infinity;
	const sortPortals = (portals: PortalData[]) => {
		portals.sort((a, b) => (getSortOrderForSlug(a.slug) > getSortOrderForSlug(b.slug) ? 1 : -1));
		return portals;
	};

	$: coolPortals = sortPortals(
		$portals.data.portals.filter(
			(p) => !unlistedPortals.has(p.slug) && p.coolness <= COOLNESS_VISIBILITY_THRESHOLD,
		),
	);

	$: superCoolPortals = sortPortals(
		$portals.data.portals.filter(
			(p) => !unlistedPortals.has(p.slug) && p.coolness > COOLNESS_VISIBILITY_THRESHOLD,
		),
	);

	// TODO what's the best way to persist this? uiStore? data per portal?
	// this is just a TEMP HACK!
	let showMorePortals = browser ? (window as any).TODO_showMorePortals || false : false; // toggle showing projects that are less cool but still cool
	$: {
		if (browser) (window as any).TODO_showMorePortals = showMorePortals;
	}
</script>

<nav class="portal-previews">
	<header>
		<PortalPreview href={aboutPortal.slug} classes="portal-preview--{aboutPortal.slug}">
			<svelte:component this={aboutPortal.Preview} portal={aboutPortal} />
		</PortalPreview>
	</header>
	{#each superCoolPortals as portal (portal.slug)}
		<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
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
			<PortalPreview href={portal.slug} classes="portal-preview--{portal.slug}">
				<svelte:component this={portal.Preview} {portal} />
			</PortalPreview>
		{/each}
	</nav>
{/if}

<style>
	header {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 15px;
	}
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
