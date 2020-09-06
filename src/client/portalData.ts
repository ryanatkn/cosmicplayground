import {PortalData} from './portalsStore.js';

// TODO maybe split this into a metadata file per portal directory? (if we do a directory per portal)
// TODO should the order be implicit, or should we add a property for sorting? coolness doesn't quite fit the bill
// TODO maybe change this to JSON?

export const portalData: PortalData[] = [
	{slug: 'portals', title: 'portals', coolness: Infinity, showBackground: true, unlisted: true},
	{slug: 'about', title: 'about', coolness: 3, showBackground: true},
	{slug: 'deep-breath', title: 'deep breath', coolness: 5, showBackground: true}, // TODO maybe hide by default but show when zoomed out?
	{slug: 'paint-freqs', title: 'paint freqs', coolness: 4, showBackground: true},
	{slug: 'starlit-hammock', title: 'starlit hammock', coolness: 3, showBackground: false},
	{
		slug: 'easings-2',
		title: 'easing function visualizations and audioizations',
		coolness: 4,
		showBackground: true,
	},
	{slug: 'easings-1', title: 'easing function visualizations', coolness: 3, showBackground: true},
	{slug: 'hearing-test', title: 'hearing test', coolness: 3, showBackground: true},
	{slug: 'under-construction', title: 'under construction', coolness: 2, showBackground: true},
	{slug: 'freq-speeds', title: 'freq speeds', coolness: 2, showBackground: true},
	{slug: 'transition-designer', title: 'transition designer', coolness: 1, showBackground: true},
	{slug: 'bundle-vision', title: 'bundle vision', coolness: 1, showBackground: true},
	{slug: 'clocks', title: 'clocks', coolness: 1, showBackground: true},
	{slug: 'freq-spectacle', title: 'freq spectacle', coolness: 1, showBackground: true},
];
