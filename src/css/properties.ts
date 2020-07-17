// TODO consider using @mdn/data
// https://github.com/mdn/data
// A downside of that approach is greatly increased complexity to parse the data.
// It also makes things less explicit - it can be nice to granularly control
// which values are available by editing this file directly.
// However, it might be nice to push that concern completely out of userland,
// and use browser support data to enable/disable stuff with a single switch.
// I don't see that browser support data right now, but I haven't looked hard.

// type is `cssPropertyValue | [cssPropertyValue, cssPropertyValueShorthand]`
export type CssPropertiesData = (string | [string, string])[];

// position
export const position: CssPropertiesData = ['static', 'relative', 'absolute', 'fixed', 'sticky'];

// display
export const display: CssPropertiesData = ['block', 'flex', 'inline', 'inline-block'];

// overflow
export const overflow: CssPropertiesData = [
	'visible',
	'hidden',
	'scroll',
	'auto',
	// 'clip', some day
];

// font-weight
// TODO consider supporting numerical weight?
// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
export const fontWeight: CssPropertiesData = ['normal', 'bold', 'lighter', 'bolder'];

// text-decoration
// TODO text-decoration-color
// TODO b/c of Edge, using plain "text-decoration" instead of "text-decoration-line" - want to undo
// https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-line
export const textDecoration: CssPropertiesData = [
	// TODO this creates an unfortunate coupling between
	// the prefix rendering and data definitions -
	// not sure what the fix is. this works it just breaks the clean design
	// that has these data definitions agnostic to class names.
	// We could go the other direction, and specify that the other values are literals
	// that need no class name prefixes, but the class concerns still bleed over in that case.
	['none', 'text-decoration-none'],
	'underline',
	'overline',
	'line-through',
];
export const textDecorationStyle: CssPropertiesData = [
	'solid',
	'double',
	'dotted',
	'dashed',
	'wavy',
];

// https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
export const cursor: CssPropertiesData = [
	'auto', 'default', 'none',
	'context-menu', 'help', 'pointer', 'progress', 'wait',
	'cell', 'crosshair', 'text', 'vertical-text',
	'alias', 'copy', 'move', 'no-drop', 'not-allowed', 'grab', 'grabbing',
	'all-scroll', 'col-resize', 'row-resize',
	'n-resize', 'e-resize', 's-resize',  'w-resize',
	'ne-resize', 'nw-resize', 'se-resize', 'sw-resize',
	'ns-resize', 'ew-resize', 'nesw-resize', 'nwse-resize',
	'zoom-in', 'zoom-out',
]; // prettier-ignore

// flexbox
export const flex: CssPropertiesData = ['auto', 'initial', 'none', '1'];

// justify content values have sketchy support - Edge support in particular is weak
// https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
export const justifyContent: CssPropertiesData = [
	'normal',
	// start/end aren't supported well so we ignore them and
	// confusingly use a shorthand for flex-start/end (like Tailwind does)
	['flex-start', 'start'],
	['flex-end', 'end'],
	'center',
	// ['start', 'plain-start'],
	// ['end', 'plain-end'],
	// 'left',
	// 'right',
	// 'baseline',
	// ['first baseline', 'first-baseline'],
	// ['last baseline', 'last-baseline'],
	['space-between', 'between'],
	['space-around', 'around'],
	// ['space-evenly', 'evenly'],
	// 'stretch', // hmm........ this may be the one that gets me to break some browsers
];

// align items
// https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
export const alignItems: CssPropertiesData = [
	'normal',
	// like with `justifyContent`, start/end aren't supported well so we ignore them and
	// confusingly use a shorthand for flex-start/end (like Tailwind does)
	['flex-start', 'start'],
	['flex-end', 'end'],
	'center',
	// ['start', 'plain-start'],
	// ['end', 'plain-end'],
	'self-start',
	'self-end',
	'baseline',
	// ['first baseline', 'first-baseline']',
	// ['last baseline', 'last-baseline']',
	// 'stretch', // hmm........ this may be the one that gets me to break some browsers
];

// flex wrap
// https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap
export const flexWrap: CssPropertiesData = ['nowrap', 'wrap', 'wrap-reverse'];
