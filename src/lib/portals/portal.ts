import {type SvelteComponent} from 'svelte';

// TODO is this the right file name? `Portal.ts`? `portalData.ts`? `portalsData.js`? `data.js`? `types.ts`?
// does it even belong in this directory?

export interface PortalsData {
	portals: PortalData[];
	portalsBySlug: Map<string, PortalData>;
}

// These properties are defined explicitly for each portal.
export interface PortalData {
	name: string;
	slug: string;
	coolness: number;
	// TODO should we make this optional and flip it? `disableBackground`
	showHomeButton: boolean; // TODO ?
	// TODO do we want a width/height for previews here?
	// previewWidth: number;
	// previewHeight: number;
	// slugAliases: string[]; // TODO if we ever change a portal slug, support redirects, and maybe add some Easter eggs
	Preview: typeof SvelteComponent;
}

export const VOID_PORTAL_SLUG = 'void';
