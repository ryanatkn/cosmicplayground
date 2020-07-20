import {BundleData, isBundleChunk, BundleChunk, BundleAsset} from './bundleData.js';
import {reorder} from '../utils/obj.js';
import {stripStart, stripEnd} from '../utils/str.js';
import {last} from '../utils/arr.js';

// `BundleStats` an expanded transformation of `BundleStats` that provides
// a more ergonomic runtime data representation.

export interface BundleStats {
	chunks: ChunkStats[];
	assets: AssetStats[];
}
export interface ChunkStats {
	name: string; // e.g. "main"
	fileName: string; // e.g. "bundle.js"
	pkg: string; // e.g. "client"
	path: string; // e.g. "client/main.ts"
	srcPath: string; // e.g. "/home/name/dev/cosmicplayground/src/"
	externalsPath: string; // e.g. "/home/name/dev/cosmicplayground/node_modules/"
	facadeModuleId: string | null; // e.g. "/home/name/dev/cosmicplayground/src/client/main.ts"
	isEntry: boolean;
	isDynamicEntry: boolean;
	dynamicImports: string[];
	exports: string[];
	imports: string[];
	modules: ModuleStats[];
}
// TODO keeping this in sync isn't terrible, but it'd be nice to use codegen
const chunkStatsKeyOrder: (keyof ChunkStats)[] = [
	'name',
	'fileName',
	'pkg',
	'path',
	'srcPath',
	'externalsPath',
	'facadeModuleId',
	'isEntry',
	'isDynamicEntry',
	'dynamicImports',
	'exports',
	'imports',
	'modules',
];
export interface ModuleStats {
	id: string; // e.g. "/home/name/dev/cosmicplayground/src/client/foo/bar.ts"
	fileName: string; // e.g. "bar.ts"
	pkg: string; // e.g. "client"
	dir: string; // e.g. "client/foo"
	path: string; // e.g. "client/foo/bar.ts"
	external?: true; // is `true` if in `node_modules`, omitted property otherwise
	originalLength: number;
	removedExports: string[];
	renderedExports: string[];
	renderedLength: number;
}
// TODO keeping this in sync isn't terrible, but it'd be nice to use codegen
const moduleStatsKeyOrder: (keyof ModuleStats)[] = [
	'id',
	'fileName',
	'pkg',
	'dir',
	'path',
	'external',
	'originalLength',
	'renderedLength',
	'removedExports',
	'renderedExports',
];
export interface AssetStats {
	fileName: string;
	isAsset: true;
}

export const toBundleStats = (bundleData: BundleData): BundleStats => {
	const chunks: ChunkStats[] = [];
	const assets: AssetStats[] = [];
	const bundles: BundleStats = {chunks, assets};

	for (const fileName in bundleData) {
		const data = bundleData[fileName];
		if (isBundleChunk(data)) {
			chunks.push(toChunkStats(data));
		} else {
			assets.push(toAssetStats(data));
		}
	}

	return bundles;
};

export const toChunkStats = (chunk: BundleChunk): ChunkStats => {
	const path = toPath(chunk.facadeModuleId!, chunk.srcPath);
	const pkg = toPkg(path);
	const stats: ChunkStats = {
		...chunk,
		// TODO the null assertion here is gross -
		// probably want to modify the bundle during build so it's never null
		pkg,
		path,
		modules: toModuleStats(chunk),
	};
	return reorder(stats, chunkStatsKeyOrder);
};
export const toAssetStats = (asset: BundleAsset): AssetStats => {
	return asset;
};

export const toModuleStats = ({srcPath, externalsPath, modules}: BundleChunk): ModuleStats[] => {
	const moduleStats: ModuleStats[] = [];
	for (const id in modules) {
		const mod = modules[id];
		const fileName = toFileName(id);
		const path = toPath(id, srcPath, externalsPath);
		const pkg = toPkg(path);
		const dir = toDir(path);
		const stats: ModuleStats = {
			id,
			fileName,
			pkg,
			dir,
			path,
			...mod,
		};
		if (id.startsWith(externalsPath)) stats.external = true;
		moduleStats.push(reorder(stats, moduleStatsKeyOrder));
	}
	return moduleStats;
};

export const toFileName = (id: string): string => last(id.split('/'));
export const toPkg = (path: string): string => path.split('/')[0];
// TODO think about if we'd prefer to always have dirs end with a /
export const toDir = (path: string): string => stripEnd(stripEnd(path, toFileName(path)), '/');
// TODO handle \u0000 - maybe add an `nullChar` or `buildIgnored` flag that's undefined or true
export const toPath = (id: string, srcPath: string, externalsPath?: string): string =>
	id.startsWith(srcPath)
		? stripStart(id, srcPath + '/')
		: externalsPath
		? stripStart(id, externalsPath + '/')
		: id;
// chunk.srcPath  chunk.externalsPath // TODO test with either of these
