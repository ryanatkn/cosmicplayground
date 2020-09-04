import {writable, Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

export interface SettingsState {
	audioEnabled: boolean;
	devMode: boolean;
	recordingMode: boolean;
}

export interface SettingsStore {
	subscribe: Writable<SettingsState>['subscribe'];
	set: Writable<SettingsState>['set'];
	update: Writable<SettingsState>['update'];
}

export const createSettingsStore = (initialState: Partial<SettingsState>): SettingsStore => {
	const store = writable({
		audioEnabled: true,
		devMode: false,
		recordingMode: false,
		...initialState,
	});
	// TODO we probably do not want to expose `set` and `update`, but for now it's fine
	const {subscribe, set, update} = store;
	return {subscribe, set, update};
};

export const settingsContextKey = {};
export const useSettings = (): SettingsStore => getContext(settingsContextKey);
export const initSettings = (initialState: Partial<SettingsState>): SettingsStore => {
	const settings = createSettingsStore(initialState);
	setContext(settingsContextKey, settings);
	return settings;
};
