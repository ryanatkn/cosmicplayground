import {writable, Writable} from 'svelte/store';

import {LevelDef} from './levelDefs';

type LevelStatsStoreState = {
	isComplete: {[key: string]: boolean};
};

interface LevelStatsStore {
	subscribe: Writable<LevelStatsStoreState>['subscribe'];
	registerSuccess(id: number): void;
}

const defaultState = (defs: LevelDef[]): LevelStatsStoreState => {
	const isComplete: {[key: string]: boolean} = {};
	for (const def of defs) {
		isComplete[def.id] = false; // TODO load from localStorage (eventually from the server)
	}
	return {
		isComplete,
	};
};

export const createLevelStatsStore = (defs: LevelDef[]): LevelStatsStore => {
	const {subscribe, update} = writable(defaultState(defs));

	return {
		subscribe,
		registerSuccess: (id: number) => {
			console.log('register success', id);
			update(s => {
				return {
					...s,
					isComplete: {
						...s.isComplete,
						[id]: true,
					},
				};
			});
		},
	};
};
