import {SyDef, ClassName, CssSelector, CssExpression} from './sy';

export const classDef = (className: ClassName, css: CssExpression): SyDef => {
	return {
		type: 'class',
		className,
		css,
		declaration: `.${className}{${css}}`,
	};
};

export const classDefs = (defs: Record<ClassName, CssExpression>): SyDef[] =>
	Object.entries(defs).map(([className, css]) => classDef(className, css));

export const selectorDef = (
	selector: CssSelector,
	css: CssExpression,
): SyDef => {
	return {
		type: 'selector',
		selector,
		css,
		declaration: `${selector}{${css}}`,
	};
};

export const selectorDefs = (
	defs: Record<CssSelector, CssExpression>,
): SyDef[] =>
	Object.entries(defs).map(([selector, css]) => selectorDef(selector, css));
