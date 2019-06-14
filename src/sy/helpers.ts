import {SyDef, ClassName, CssSelector, CssExpression} from './sy';

export const classDef = (
	className: ClassName,
	expression: CssExpression,
): SyDef => {
	return {
		type: 'class',
		className,
		expression,
		declaration: `.${className}{${expression}}`,
	};
};

export const classDefs = (defs: Record<ClassName, CssExpression>): SyDef[] =>
	Object.entries(defs).map(([className, expression]) =>
		classDef(className, expression),
	);

export const selectorDef = (
	selector: CssSelector,
	expression: CssExpression,
): SyDef => {
	return {
		type: 'selector',
		selector,
		expression,
		declaration: `${selector}{${expression}}`,
	};
};

export const selectorDefs = (
	defs: Record<CssSelector, CssExpression>,
): SyDef[] =>
	Object.entries(defs).map(([selector, expression]) =>
		selectorDef(selector, expression),
	);
