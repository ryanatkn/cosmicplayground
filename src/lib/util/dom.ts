import {isEditable} from '@feltcoop/felt/util/dom.js';

export const enableGlobalHotkeys = (target: unknown): boolean =>
	!!target && !isEditable(target as any); // TODO upgrade Felt

// TODO upstream to Felt
export const swallow = <T extends Event>(e: T): T => {
	e.stopImmediatePropagation();
	e.preventDefault();
	return e;
};
