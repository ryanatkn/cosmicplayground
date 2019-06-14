import {SyDef, ClassName, CssSelector, CssDeclaration} from './sy';

export const classDef = (
	className: ClassName,
	declaration: CssDeclaration,
): SyDef => {
	return {
		type: 'class',
		className,
		declaration,
		rule: `.${className}{${declaration}}`,
	};
};

export const classDefs = (defs: Record<ClassName, CssDeclaration>): SyDef[] =>
	Object.entries(defs).map(([className, declaration]) =>
		classDef(className, declaration),
	);

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
