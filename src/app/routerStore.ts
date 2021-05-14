import {writable} from 'svelte/store';
import type {Writable} from 'svelte/store';
import {setContext, getContext} from 'svelte';

// TODO currently this store is readonly,
// but we'll need methods like `goTo` eventually I'm sure

export interface RouterState {
	hash: string;
	slug: string;
}

export interface RouterStore {
	subscribe: Writable<RouterState>['subscribe'];
}

export const createRouterStore = (
	initialState = parseRouterState(window.location.hash),
): RouterStore => {
	const onHashChange = () => {
		set(parseRouterState(window.location.hash));
	};
	const store = writable(initialState, () => {
		window.addEventListener('hashchange', onHashChange);
		return () => {
			window.removeEventListener('hashchange', onHashChange);
		};
	});
	const {subscribe, set} = store;
	return {subscribe};
};

const parseRouterState = (hash: string): RouterState => ({hash, slug: parseSlug(hash)});

// TODO eventually we'll probably want encoded data, maybe JSON for simplicity
const DEFAULT_PORTAL_SLUG = 'home';
const parseSlug = (hash: string): string => hash.slice(1) || DEFAULT_PORTAL_SLUG;

export const routerContextKey = {};
export const useRouter = (): RouterStore => getContext(routerContextKey);
export const provideRouter = (router = createRouterStore()): RouterStore => {
	setContext(routerContextKey, router);
	return router;
};
