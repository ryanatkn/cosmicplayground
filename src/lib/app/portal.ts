import type {SvelteComponent} from 'svelte';

// TODO is this the right file name? `Portal.ts`? `portalData.ts`? `portals_data.js`? `data.js`? `types.ts`?
// does it even belong in this directory?

export interface PortalsData {
	portals: PortalData[];
	portals_by_slug: Map<string, PortalData>;
}

// These properties are defined explicitly for each portal.
export interface PortalData {
	name: string;
	slug: string;
	// TODO should we make this optional and flip it? `disableBackground`
	showHomeButton: boolean; // TODO ?
	// TODO do we want a width/height for previews here?
	// previewWidth: number;
	// previewHeight: number;
	// slugAliases: string[]; // TODO if we ever change a portal slug, support redirects, and maybe add some Easter eggs
	Preview: typeof SvelteComponent;
}
