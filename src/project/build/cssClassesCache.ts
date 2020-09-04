import {gray, green} from '@feltcoop/gro/dist/colors/terminal.js';
import {omitUndefined} from '@feltcoop/gro/dist/utils/object.js';

import {CssClass} from '../../sy/sy.js';
import {LogLevel, logger} from '../logger.js';

export interface CssClassesCache {
	getUsedCssClasses(): Set<CssClass>;
	setUsedCssClasses(id: string, classes: Set<CssClass>): void;
	getDefinedCssClasses(): Set<CssClass>;
	setDefinedCssClasses(id: string, classes: Set<CssClass>): void;
	getUndefinedCssClasses(): Set<CssClass>;
}

export interface Options {
	logLevel: LogLevel;
}
export type RequiredOptions = never;
export type InitialOptions = PartialExcept<Options, RequiredOptions>;

export const defaultOptions = (initialOptions: InitialOptions): Options => ({
	logLevel: LogLevel.Info,
	...omitUndefined(initialOptions),
});

type CssClassCacheOp = [CssClass, boolean]; // `[cssClass, added]`, where `added` is false when removed

// TODO investigate if initial setup can be sped up, to not do a lot of checks
// maybe do defined first somehow? need to keep things simple tho

export const createCssClassesCache = (pluginOptions: InitialOptions = {}): CssClassesCache => {
	const {logLevel} = defaultOptions(pluginOptions);

	const {info} = logger(logLevel, [green('[cssClassesCache]')]);

	// These are build-wide sets of css classes.
	// They get efficiently updated at a granular level using
	// cache operations, `CssClassCacheOp`, that are computed
	// whenever a file updates its classes.
	// The cache ops enable efficient state recalculation.

	// Used classes appear in the markup or scripts.
	const usedClasses = new Set<CssClass>();

	// Defined classes appear in svelte styles, imported css, or `sy` config.
	const definedClasses = new Set<CssClass>();

	// Undefined classes are those that are used but not defined.
	// They appear in the markup or scripts,
	// but do not exist in the svelte styles, imported css, or `sy` config.
	const undefinedClasses = new Set<CssClass>();

	// These track used and defined classes per file id.
	// This allows us to diff a limited subset to compute the cache ops.
	const usedClassesById: Map<string, Set<CssClass>> = new Map(); // TODO consider a FileId string helper type?
	const definedClassesById: Map<string, Set<CssClass>> = new Map();

	// Track the counts that each css class is used or defined.
	// If the count is 0, it does not appear in the map,
	// so existence can be checked with `counts.has('className')`.
	// This reference tracking is needed because css classes can be
	// used in multiple places, and this allows us to granularly track
	// changes to maximize rebuild performance.
	// Returns the new count value.
	const usedClassCounts: Map<CssClass, number> = new Map();
	const definedClassCounts: Map<CssClass, number> = new Map();

	const setUsedCssClasses = (id: string, classes: Set<CssClass> | undefined): void => {
		if (classes && !classes.size) classes = undefined; // TODO are these the right semantics? so files that have no classes are same as nonexistent? probably
		info(gray('setUsedCssClasses'), id);
		const prevClasses = usedClassesById.get(id);
		const ops = diffClasses(classes, prevClasses);
		// trace('ops', ops);
		for (const op of ops) {
			// trace('op', op);
			const [cssClass, added] = op;
			const count = applyCacheOp(usedClasses, usedClassCounts, op);
			// trace(gray('setUsedCssClasses op'), op, count);
			// update undefined classes
			if (added) {
				// is it defined? if no, add to undefined
				if (!definedClasses.has(cssClass)) {
					// trace(gray('add undefined class'), cssClass);
					undefinedClasses.add(cssClass);
				}
			} else {
				// is it the last reference, and is it defined? if yes+no, remove from undefined
				if (!count && !definedClasses.has(cssClass)) {
					// trace(gray('delete undefined class'), cssClass);
					undefinedClasses.delete(cssClass);
				}
			}
		}
		if (classes) {
			usedClassesById.set(id, classes);
		} else {
			usedClassesById.delete(id);
		}
	};

	// TODO This shares a lot of code and patterns as `setUsedCssClasses`,
	// but there are some subtle differences around updating the undefined classes.
	// For now we're opting for code duplication over abstraction.
	// It'd be easy to abstract this logic into a callback once things are working.
	const setDefinedCssClasses = (id: string, classes: Set<CssClass> | undefined): void => {
		if (classes && !classes.size) classes = undefined; // TODO are these the right semantics? so files that have no classes are same as nonexistent? probably
		info(gray('setDefinedCssClasses'), id);
		const prevClasses = definedClassesById.get(id);
		const ops = diffClasses(classes, prevClasses);
		for (const op of ops) {
			const [cssClass, added] = op;
			const count = applyCacheOp(definedClasses, definedClassCounts, op);
			// update undefined classes
			if (added) {
				// is it used? if yes, remove from undefined
				if (usedClasses.has(cssClass)) {
					// trace(gray('delete undefined class'), cssClass);
					undefinedClasses.delete(cssClass);
				}
			} else {
				// is it the last reference, and is it used? if yes+yes, add to undefined
				if (!count && usedClasses.has(cssClass)) {
					// trace(gray('add undefined class'), cssClass);
					undefinedClasses.add(cssClass);
				}
			}
		}
		if (classes) {
			definedClassesById.set(id, classes);
		} else {
			definedClassesById.delete(id);
		}
	};

	return {
		getUsedCssClasses: () => usedClasses,
		setUsedCssClasses,
		getDefinedCssClasses: () => definedClasses,
		setDefinedCssClasses,
		getUndefinedCssClasses: () => undefinedClasses,
	};
};

// Mutates `classes` and `counts` by applying a cache operation.
// Updating the classes and counts could be separate functions,
// but because they're so interrelated it feels nice to update them as a unit.
const applyCacheOp = (
	classes: Set<CssClass>,
	counts: Map<CssClass, number>,
	[cssClass, added]: CssClassCacheOp,
): number | undefined => {
	const prevCount = counts.get(cssClass);
	if (added) {
		const nextCount = (prevCount || 0) + 1;
		counts.set(cssClass, nextCount);
		if (nextCount === 1) classes.add(cssClass);
		return nextCount;
	} else {
		// removed
		if (!prevCount) {
			throw Error(`Unexpected cssClassesCache state: ${prevCount}`);
		} else if (prevCount === 1) {
			counts.delete(cssClass);
			classes.delete(cssClass);
			return undefined;
		} else {
			const nextCount = prevCount - 1;
			counts.set(cssClass, nextCount);
			return nextCount;
		}
	}
};

// Returns an array of ops indicating additions and removals to the classes.
const diffClasses = (
	nextClasses: Set<CssClass> | undefined,
	prevClasses: Set<CssClass> | undefined,
): CssClassCacheOp[] => {
	if (!prevClasses) {
		if (!nextClasses) return [];
		const ops: CssClassCacheOp[] = [];
		for (const cls of nextClasses) ops.push([cls, true]);
		return ops;
	} else if (!nextClasses) {
		const ops: CssClassCacheOp[] = [];
		for (const cls of prevClasses) ops.push([cls, false]);
		return ops;
	}
	// this can surely be done more efficiently, but this is fine; sets are rad
	const ops: CssClassCacheOp[] = [];
	for (const cls of nextClasses) {
		if (!prevClasses.has(cls)) ops.push([cls, true]);
	}
	for (const cls of prevClasses) {
		if (!nextClasses.has(cls)) ops.push([cls, false]);
	}
	return ops;
};
