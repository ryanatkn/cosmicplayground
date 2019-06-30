import {SyDef, CssClass, CssSelector, CssDeclaration, SyConfig} from './sy';
import {UnreachableError} from '../utils/types';

export const classDef = (
	className: CssClass,
	declaration: CssDeclaration,
): SyDef => {
	return {
		type: 'class',
		className,
		declaration,
		rule: `.${className}{${declaration}}`,
	};
};

export const classDefs = (defs: Record<CssClass, CssDeclaration>): SyDef[] =>
	Object.entries(defs).map(([className, declaration]) =>
		classDef(className, declaration),
	);

export const propsToClassDefs = (props: string[], name: string): SyDef[] =>
	props.map(p => classDef(`${name}-${p}`, `${name}: ${p}`));

export const selectorDef = (
	selector: CssSelector,
	declaration: CssDeclaration,
): SyDef => {
	return {
		type: 'selector',
		selector,
		declaration,
		rule: `${selector}{${declaration}}`,
	};
};

export const selectorDefs = (
	defs: Record<CssSelector, CssDeclaration>,
): SyDef[] =>
	Object.entries(defs).map(([selector, declaration]) =>
		selectorDef(selector, declaration),
	);

export const removeClasses = (
	config: SyConfig,
	classes: Set<CssClass>,
): SyConfig => {
	return {
		...config,
		defs: config.defs.filter(def => {
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
