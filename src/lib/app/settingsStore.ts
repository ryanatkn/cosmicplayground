import {writable, type Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

export interface SettingsState {
	audioEnabled: boolean;
	devMode: boolean;
	recordingMode: boolean;
	idleMode: boolean;
	timeToGoIdle: number;
}

export interface SettingsStore {
	subscribe: Writable<SettingsState>['subscribe'];
	update: Writable<SettingsState>['update'];
}

export const createSettingsStore = (initialState: Partial<SettingsState>): SettingsStore => {
	const store = writable({
		audioEnabled: true,
		devMode: false,
		recordingMode: false,
		idleMode: false,
		timeToGoIdle: 6000,
		...initialState,
	});
	// TODO we might not want to expose `update` directly, but for now it's fine
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