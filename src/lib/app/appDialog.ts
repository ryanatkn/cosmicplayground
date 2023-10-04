import {writable} from 'svelte/store';

export const show_app_dialog = writable(false);

// TODO terribly hacky
export const appDialogEl = writable<HTMLElement | null>(null);
