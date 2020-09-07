import {Gen} from '@feltcoop/gro/dist/gen/gen.js';
import {dirname, join} from 'path';
import {readdirSync} from 'fs';
import {stat} from '@feltcoop/gro/dist/fs/nodeFs.js';
import {toBuildId} from '@feltcoop/gro/dist/paths.js';

import {PortalBaseData} from './portal.js';

// TODO ideally we lazy load all of the actual `View` code for each portal,
// and only eagerly load the `Preview` code and metadata,
// but this involves code splitting that I want to punt on for now,
// giant JS bundle4life

// TODO move this helper somewhere better, maybe to Gro
const readDirs = async (dir: string): Promise<string[]> =>
	(
		await Promise.all(
			readdirSync(dir).map(async (path) =>
				(await stat(join(dir, path))).isDirectory() ? path : null,
			),
		)
	).filter(Boolean) as string[];

// TODO capitalize helper in gro string utils?
const slugToName = (slug: string): string =>
	slug
		.split('-')
		.map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
		.join('');

export const gen: Gen = async ({originId}) => {
	const originDir = dirname(originId);
	const portalSlugs = await readDirs(originDir);

	const namesBySlug = new Map(portalSlugs.map((slug) => [slug, slugToName(slug)]));
	const dataBySlug = new Map<string, PortalBaseData>(
		await Promise.all(
			portalSlugs.map(async (slug) => [
				slug,
				(await import(toBuildId(join(originDir, slug, 'data.ts')))).default,
			]) as any,
		),
	);

	return `
import {PortalsData, PortalData} from './portal.js';

${portalSlugs
	.map((slug) => {
		const name = namesBySlug.get(slug);
		return `
			import ${name}View from './${slug}/View.svelte';
			import ${name}Preview from './${slug}/Preview.svelte';`;
	})
	.join('')}

const portals: PortalData[] = [
	${portalSlugs
		.map((slug) => {
			const name = namesBySlug.get(slug)!;
			const data = dataBySlug.get(slug)!;
			return `
	{
		slug: '${slug}',
		View: ${name}View,
		Preview: ${name}Preview,
		${JSON.stringify(data).slice(1, -1)}
	},`;
		})
		.join('')}
];

export const portalsData: PortalsData = {
	portals,
	portalsBySlug: new Map(portals.map((p) => [p.slug, p])),
};
`;
};
