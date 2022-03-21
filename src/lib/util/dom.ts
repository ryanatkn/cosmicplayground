import {isEditable} from '@feltcoop/felt/util/dom.js';

export const enableGlobalHotkeys = (target: unknown): boolean =>
	!!target && !isEditable(target as any); // TODO upgrade Felt
