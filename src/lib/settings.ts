import {writable, type Writable} from 'svelte/store';
import {create_context} from '@ryanatkn/fuz/context_helpers.js';

export const settings_context = create_context<SettingsStore>();

export interface SettingsState {
	audio_enabled: boolean;
	dev_mode: boolean; // TODO use felt `devmode` probably
	recording_mode: boolean;
	idle_mode: boolean;
	time_to_go_idle: number;
	secret_enabled: boolean;
}

export interface SettingsStore {
	subscribe: Writable<SettingsState>['subscribe'];
	update: Writable<SettingsState>['update'];
}

// TODO refactor to `getApp` and make each an individual store
export const create_settings_store = (initial_state: Partial<SettingsState>): SettingsStore => {
	const store = writable({
		audio_enabled: true,
		dev_mode: false,
		recording_mode: false,
		idle_mode: false,
		time_to_go_idle: 6000,
		secret_enabled: false,
		...initial_state,
	});
	const {subscribe, update} = store;
	return {subscribe, update};
};
