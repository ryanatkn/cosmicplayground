import {writable} from 'svelte/store';

export const showAppDialog = writable(false);
export const appDialogEl = writable<HTMLElement | null>(null);
