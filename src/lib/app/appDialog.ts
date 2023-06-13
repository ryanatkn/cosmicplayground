import {writable} from 'svelte/store';

export const show_app_dialog = writable(false);
export const appDialogEl = writable<HTMLElement | null>(null);
