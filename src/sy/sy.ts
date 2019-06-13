/*

`sy` is a tool that builds css from a data structure

*/

export const sy = (config: SyConfig): SyBuild => {
	const {classes, banner, footer} = config;
	const defs: SyDefBuild[] = [];
	for (const className in classes) {
		const def = classes[className];
		const defObj: SyClassDef = typeof def === 'string' ? {css: def} : def;
		const defBuild = buildClassDef(className, defObj, config);
		defs.push(defBuild);
	}
	return {
		defs,
		styles:
			(banner || defaultBanner)(config) +
			defs.map(d => d.declaration).join('') +
			(footer || defaultFooter)(config),
	};
};

export type SyClassDefs = Record<ClassName, CssExpression | SyClassDef>;
export type SyClassDef = {
	css: CssExpression; // TODO consider accepting `((opts) => string)` to allow dyanmic construction
	// ...
};
// TODO support builds other than classes - like css custom properties, keyframe animations, etc
// `interface SyDefBuild { ... }` might become `type SyDefBuild = SyClassDefBuild | SyVarDefBuild | SyKeyframesDefBuild`
// (maybe improve the name)
interface SyDefBuild {
	className: ClassName;
	css: CssExpression;
	declaration: CssDeclaration;
}

// these are for documentation purposes - they don't do anything for type safety
export type ClassName = string;
export type CssExpression = string;
export type CssDeclaration = string;
export type CssString = string;

export interface SyConfig {
	classes: SyClassDefs;
	banner?(config: SyConfig): string;
	footer?(config: SyConfig): string;
}
// This type is the shape of the config file (e.g. `sy.config.ts`).
// It's used to get types for dynamic imports/requires.
export interface SyConfigModule {
	// Callers may include a `configPartial` but any part of it can be ignored.
	// Callers can then further change the returned config if needed.
	createConfig(partial: Partial<SyConfig>): Promise<SyConfig>;
}

export interface SyBuild {
	defs: SyDefBuild[];
	styles: CssString;
}

export const buildClassDef = (
	className: ClassName,
	def: SyClassDef,
	_config: SyConfig,
): SyDefBuild => {
	const {css} = def;
	return {
		className,
		css,
		declaration: `.${className}{${css}}`,
	};
};
export const defaultBanner = (_config: SyConfig): string => `/* sy */\n`;
export const defaultFooter = (_config: SyConfig): string => `\n/* sy */`;
