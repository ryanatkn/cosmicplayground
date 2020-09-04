import {OutputBundle, OutputChunk, OutputAsset} from 'rollup';
import {mapRecord, reorder} from '@feltcoop/gro/dist/utils/object.js';

import {omit} from '../utils/obj.js';

// `BundleData` gets written by `rollup-plugin-bundle-writer`
// and gets imported into the app as a json asset.
// It's minimally transformed from the `rollup` output:
// the only changes are field removals, e.g. the raw code,
// which can always be fetched granularly if needed,
// and some helpful meta data that's best applied from the build.
// It's optimized for efficient storage and transfort.
// `BundleData` can be expanded into `BundleStats` for better ergonomics.

export type BundleData = {
	[fileName: string]: BundleChunk | BundleAsset;
};

export const toBundleData = (outputBundle: OutputBundle, meta: BundleChunkMeta): BundleData =>
	mapRecord(outputBundle, (b) => toBundleChunkOrAsset(b, meta));

export const toBundleChunkOrAsset = (
	chunkOrAsset: OutputChunk | OutputAsset,
	meta: BundleChunkMeta,
): BundleChunk | BundleAsset => {
	if (isOutputChunk(chunkOrAsset)) {
		const chunk: BundleChunk = {
			...omit(chunkOrAsset, excludedChunkKeys),
			...meta,
		};
		// reorder the keys for ergonomics
		return reorder(chunk, bundleChunkKeyOrder);
	} else {
		return omit(chunkOrAsset, excludedAssetKeys);
	}
};

// This is a bit wonky but I don't know a better way to tie together types and
// runtime data without reaching for codegen. TODO maybe use codegen?
// If only functions could return types! (ocaml modules?)
const excludedChunkKeysDef = {code: null, map: null};
type ExcludedChunkKeys = keyof typeof excludedChunkKeysDef;
const excludedChunkKeys = Object.keys(excludedChunkKeysDef) as ExcludedChunkKeys[];

// Seems like the interface form is generally preferable -
// they're lazy, which among other things has better display readability,
// and they error on collisons instead of creating an intersection type.
// Collisions can just be manually omitted. (that's not why these are omitted)
// export type BundleChunk = OmitStrict<OutputChunk, 'code' | 'map'> &
// 	BundleChunkMeta;
export interface BundleChunk extends OmitStrict<OutputChunk, 'code' | 'map'>, BundleChunkMeta {}
// TODO keeping this in sync isn't terrible, but it'd be nice to use codegen
const bundleChunkKeyOrder: (keyof BundleChunk)[] = [
	'name',
	'fileName',
	'srcPath',
	'externalsPath',
	'facadeModuleId',
	'isEntry',
	'isDynamicEntry',
];

// Additional fields to add to rollup's OutputChunk.
// Right now there's no equivalent for assets.
export interface BundleChunkMeta {
	srcPath: string; // e.g. "/home/name/dev/cosmicplayground/src/"
	externalsPath: string; // e.g. "/home/name/dev/cosmicplayground/node_modules/"
}

const excludedAssetKeysDef = {code: null, source: null};
type ExcludedAssetKeys = keyof typeof excludedAssetKeysDef;
const excludedAssetKeys = Object.keys(excludedAssetKeysDef) as ExcludedAssetKeys[];
export type BundleAsset = OmitStrict<OutputAsset, 'source'>;

// TODO do we need these helpers with Rollup 2?
export const isOutputAsset = (c: OutputChunk | OutputAsset): c is OutputAsset => c.type === 'asset';
export const isOutputChunk = (c: OutputChunk | OutputAsset): c is OutputChunk => !isOutputAsset(c);
export const isBundleAsset = (c: BundleChunk | BundleAsset): c is BundleAsset => c.type === 'asset';
export const isBundleChunk = (c: BundleChunk | BundleAsset): c is BundleChunk => !isBundleAsset(c);
