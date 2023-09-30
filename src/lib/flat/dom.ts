import {is_editable} from '@grogarden/util/dom.js';

export const enable_global_hotkeys = (target: unknown): boolean =>
	!!target && !is_editable(target as any); // TODO upgrade Felt
