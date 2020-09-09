import {SvelteComponent} from 'svelte';

// TODO is this the right file name? `Portal.ts`? `portalData.ts`? `portalsData.js`? `data.js`? `types.ts`?
// does it even belong in this directory?

export interface PortalsData {
	portals: PortalData[];
	portalsBySlug: Map<string, PortalData>;
}

// `PortalData` extends the explicitly defined `PortalBaseData`
// with inferred properties added in a codegen step.
// See `./index.gen.ts` for more.
export interface PortalData extends PortalBaseData {
	slug: string; // TODO flavored Slug or PortalSlug type?
	View: typeof SvelteComponent;
	Preview: typeof SvelteComponent;
}

// These properties are defined explicitly for each portal.
export interface PortalBaseData {
	title: string;
	coolness: number;
	// TODO should we make this optional and flip it? `disableBackground`
	showHomeButton: boolean; // TODO ?
	// TODO do we want a width/height for previews here?
	// previewWidth: number;
	// previewHeight: number;
	// slugAliases: string[]; // TODO if we ever change a portal slug, support redirects, and maybe add some Easter eggs
}
