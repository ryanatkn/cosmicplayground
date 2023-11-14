import {writable, type Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

export interface SettingsState {
	audio_enabled: boolean;
	dev_mode: boolean; // TODO use felt `devmode` probably
	recording_mode: boolean;
	idle_mode: boolean;
	time_to_go_idle: number;
	secretEnabled: boolean;
}

export interface SettingsStore {
	subscribe: Writable<SettingsState>['subscribe'];
	update: Writable<SettingsState>['update'];
}

// TODO refactor to `getApp` and make each an individual store
export const createSettingsStore = (initialState: Partial<SettingsState>): SettingsStore => {
	const store = writable({
		audio_enabled: true,
		dev_mode: false,
		recording_mode: false,
		idle_mode: false,
		time_to_go_idle: 6000,
		secretEnabled: false,
		...initialState,
	});
	const {subscribe, update} = store;
	return {subscribe, update};
};

export const settingsContextKey = {};
export const get_settings = (): SettingsStore => getContext(settingsContextKey);
export const set_settings = (initialState: Partial<SettingsState>): SettingsStore => {
	const settings = createSettingsStore(initialState);
	setContext(settingsContextKey, settings);
	return settings;
};
