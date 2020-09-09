import {writable, Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

export interface SettingsState {
	audioEnabled: boolean;
	devMode: boolean;
	recordingMode: boolean;
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
		timeToGoIdle: 6000,
		...initialState,
	});
	// TODO we might not want to expose `update` directly, but for now it's fine
	const {subscribe, update} = store;
	return {subscribe, update};
};

export const settingsContextKey = {};
export const useSettings = (): SettingsStore => getContext(settingsContextKey);
export const provideSettings = (initialState: Partial<SettingsState>): SettingsStore => {
	const settings = createSettingsStore(initialState);
	setContext(settingsContextKey, settings);
	return settings;
};
