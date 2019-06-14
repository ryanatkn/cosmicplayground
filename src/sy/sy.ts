/*

`sy` is a tool that builds css from data using js/ts/etc

*/

export const sy = (config: SyConfig): SyBuild => {
	const {defs, banner, footer} = config;
	return {
		defs,
		styles:
			(banner || defaultBanner)(config) +
			defs.map(d => d.rule).join('') +
			(footer || defaultFooter)(config),
	};
};

export interface SyConfig {
	defs: SyDef[];
	banner?(config: SyConfig): string;
	footer?(config: SyConfig): string;
}

export interface SyBuild {
	defs: SyDef[];
	styles: CssString;
}

export type SyDef = SyClassDef | SySelectorDef;
export interface SyBaseDef {
	rule: CssRule;
}
export interface SyClassDef extends SyBaseDef {
	type: 'class';
	className: ClassName;
	declaration: CssDeclaration;
}
export interface SySelectorDef extends SyBaseDef {
	type: 'selector';
	selector: CssSelector;
	declaration: CssDeclaration;
}

// these are for documentation purposes - they don't do anything for type safety
export type ClassName = string;
export type CssDeclaration = string;
export type CssRule = string;
export type CssSelector = string;
export type CssString = string;

export const defaultBanner = (_config: SyConfig): string => `/* sy */\n`;
export const defaultFooter = (_config: SyConfig): string => `\n/* sy */`;
