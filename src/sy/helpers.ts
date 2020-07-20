import {SyDef, CssClass, CssSelector, CssDeclaration, SyConfig} from './sy.js';
import {UnreachableError} from '../utils/types.js';

export const classDef = (className: CssClass, declaration: CssDeclaration): SyDef => {
	return {
		type: 'class',
		className,
		declaration,
		rule: `.${className}{${declaration}}`,
	};
};

export const classDefs = (defs: Record<CssClass, CssDeclaration>): SyDef[] =>
	Object.entries(defs).map(([className, declaration]) => classDef(className, declaration));

// `props` can be a string that's directly mapped
// from css property value to css class suffix,
// or it can be a tuple of the form `[cssPropertyValue, classSuffix]`,
// e.g. `['flex-start', 'start']`
export const propsToClassDefs = (
	props: (string | string[])[],
	propName: string,
	classPrefix = propName,
): SyDef[] =>
	props.map((p) =>
		typeof p === 'string'
			? classDef(classPrefix ? `${classPrefix}-${p}` : p, `${propName}: ${p}`)
			: classDef(classPrefix ? `${classPrefix}-${p[1]}` : p[1], `${propName}: ${p[0]}`),
	);

export const selectorDef = (selector: CssSelector, declaration: CssDeclaration): SyDef => {
	return {
		type: 'selector',
		selector,
		declaration,
		rule: `${selector}{${declaration}}`,
	};
};

export const selectorDefs = (defs: Record<CssSelector, CssDeclaration>): SyDef[] =>
	Object.entries(defs).map(([selector, declaration]) => selectorDef(selector, declaration));

export const removeClasses = (config: SyConfig, classes: Set<CssClass>): SyConfig => {
	return {
		...config,
		defs: config.defs.filter((def) => {
			switch (def.type) {
				case 'class': {
					return classes.has(def.className);
				}
				case 'selector': {
					return true;
				}
				default: {
					throw new UnreachableError(def);
				}
			}
		}),
	};
};
