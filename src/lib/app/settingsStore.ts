import {writable, type Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

export interface SettingsState {
	audioEnabled: boolean;
	devMode: boolean; // TODO use felt `devmode` probably
	recordingMode: boolean;
	idleMode: boolean;
	timeToGoIdle: number;
}

export interface SettingsStore {
	subscribe: Writable<SettingsState>['subscribe'];
	update: Writable<SettingsState>['update'];
}

// TODO refactor to `getApp` and make each an individual store
export const createSettingsStore = (initialState: Partial<SettingsState>): SettingsStore => {
	const store = writable({
		audioEnabled: true,
		devMode: false,
		recordingMode: false,
		idleMode: false,
		timeToGoIdle: 6000,
		...initialState,
	});
	const {subscribe, update} = store;
	return {subscribe, update};
};

export const settingsContextKey = {};
export const getSettings = (): SettingsStore => getContext(settingsContextKey);
export const setSettings = (initialState: Partial<SettingsState>): SettingsStore => {
	const settings = createSettingsStore(initialState);
	setContext(settingsContextKey, settings);
	return settings;
};
