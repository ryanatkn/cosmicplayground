import {getContext, setContext} from 'svelte';
import {get, writable} from 'svelte/store';

import type {ClockStore} from '$lib/clock';

const KEY = Symbol('app_dialog');

export class App_Dialog_State {
	show_app_dialog = writable(false);

	// TODO hacky to deal with elements
	app_dialog_el = writable<HTMLElement | null>(null);

	paused_on_open = false; // used to resume only if it wasn't paused before opening

	constructor(private readonly clock: ClockStore) {}

	open(): void {
		this.show_app_dialog.set(true);
		if (get(this.clock).running) {
			this.clock.pause();
			this.paused_on_open = true;
		} else {
			this.paused_on_open = false;
		}
	}

	close(): void {
		this.show_app_dialog.set(false);
		this.app_dialog_el.set(null);
		if (this.paused_on_open) this.clock.resume();
	}

	toggle(): boolean {
		if (get(this.show_app_dialog)) {
			this.close();
			return false;
		} else {
			this.open();
			return true;
		}
	}
}

export const get_app_dialog = (): App_Dialog_State => getContext(KEY);

export const set_app_dialog = (v: App_Dialog_State): App_Dialog_State => setContext(KEY, v);
