import {writable} from 'svelte/store';

export const show_app_dialog = writable(false);

// TODO terribly hacky
export const app_dialog_el = writable<HTMLElement | null>(null);
