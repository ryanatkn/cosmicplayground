// TODO consider using @mdn/data
// https://github.com/mdn/data
// A downside of that approach is greatly increased complexity to parse the data.
// It also makes things less explicit - it can be nice to granularly control
// which values are available by editing this file directly.
// However, it might be nice to push that concern completely out of userland,
// and use browser support data to enable/disable stuff with a single switch.
// I don't see that browser support data right now, but I haven't looked hard.

// https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
export const cursor = [
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

// justify content values have sketchy support - Edge support in particular is weak
// https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
export const justifyContent = [
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
export const alignItems = [
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
