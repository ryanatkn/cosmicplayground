import {gray} from 'kleur';

import {CssClass} from '../../sy/sy';
import {assignDefaults} from '../../utils/obj';
import {LogLevel, logger} from '../logger';

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

export const defaultOptions = (): Options => ({
	logLevel: LogLevel.Info,
});

export const createCssClassesCache = (
	pluginOptions: InitialOptions = {},
): CssClassesCache => {
	const {logLevel} = assignDefaults(defaultOptions(), pluginOptions);

	const {info, trace} = logger(logLevel);

	const usedClassesById: Map<string, Set<CssClass>> = new Map();
	const definedClassesById: Map<string, Set<CssClass>> = new Map();

	// We store the used and defined classes by id in
	// `usedClassesById` and `definedClassesById`,
	// to enable quicker recomptuation after changes.
	// We're currently throwing away each file/id's classes and recomputing
	// whenever there's a change, to make sure we don't retain stale classes
	// that were removed.
	// TODO `recomputeUsedClasses` could be much faster if we diffed which
	// classes get added/removed upstream
	const usedClasses = new Set<CssClass>();
	let usedClassesChanged = true;
	const recomputeUsedClasses = (): Set<CssClass> => {
		info('recomputing used classes');
		usedClasses.clear();
		for (const classes of usedClassesById.values()) {
			for (const cls of classes) {
				usedClasses.add(cls);
			}
		}
		return usedClasses;
	};
	const getUsedCssClasses = (): Set<CssClass> => {
		if (!usedClassesChanged) return usedClasses;
		usedClassesChanged = false;
		return recomputeUsedClasses();
	};
	const setUsedCssClasses = (id: string, classes: Set<CssClass>): void => {
		trace(gray('setUsedCssClasses'), id, Array.from(classes));
		// TODO see above not about diffing classes that get added/removed upstream to increase perf
		usedClassesChanged = true;
		usedClassesById.set(id, classes);
	};

	// TODO this is duplicated for the above - should they share an abstraction?
	// before doing that, investigate css class diffing as discussed above
	const definedClasses = new Set<CssClass>();
	let definedClassesChanged = true;
	const recomputeDefinedClasses = (): Set<CssClass> => {
		info('recomputing defined classes');
		definedClasses.clear();
		for (const classes of definedClassesById.values()) {
			for (const cls of classes) {
				definedClasses.add(cls);
			}
		}
		return definedClasses;
	};
	const getDefinedCssClasses = (): Set<CssClass> => {
		if (!definedClassesChanged) return definedClasses;
		definedClassesChanged = false;
		return recomputeDefinedClasses();
	};
	const setDefinedCssClasses = (id: string, classes: Set<CssClass>): void => {
		trace(gray('setDefinedCssClasses'), id, Array.from(classes));
		// TODO see above not about diffing classes that get added/removed upstream to increase perf
		definedClassesChanged = true;
		definedClassesById.set(id, classes);
	};

	// `undefinedClasses` are used but not defined.
	// They're those that appear in the markup or script,
	// but do not exist in the css or `sy` config.
	const computeUndefinedClasses = (
		usedClasses: Set<CssClass>,
		definedClasses: Set<CssClass>,
	): Set<CssClass> => {
		const undefinedClasses = new Set<CssClass>();
		for (const c of usedClasses) {
			if (!definedClasses.has(c)) undefinedClasses.add(c);
		}
		return undefinedClasses;
	};
	const getUndefinedCssClasses = (): Set<CssClass> => {
		// TODO perf could definitely be improved
		return computeUndefinedClasses(getUsedCssClasses(), getDefinedCssClasses());
	};

	return {
		getUsedCssClasses,
		setUsedCssClasses,
		getDefinedCssClasses,
		setDefinedCssClasses,
		getUndefinedCssClasses,
	};
};
