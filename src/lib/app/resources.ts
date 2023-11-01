import {writable, type Readable, type Writable} from 'svelte/store';
import type {Async_Status} from '@grogarden/util/async.js';
import {Unreachable_Error} from '@grogarden/util/error.js';
import {Assets} from '@pixi/assets';
import type {Texture} from '@pixi/core';

/*

This module was quickly thrown together to centralize some basic loading tasks,
but the later introduction of Pixi and its loader makes it redundant.
Pixi's loader API has been difficult to work with for some tasks,
but it's better than this half-baked implementation
and I don't want to go plumbing through Pixi to make it work with an external loader.
So this module should probably be removed, and its usage replaced with Pixi's loader.

*/

// TODO support retries

export interface ResourcesStore extends Readable<ResourcesState> {
	addResource: <T extends ResourceType>(type: T, url: string) => ResourceTypes[T];
	load: () => Promise<void>;
}

export interface ResourcesState {
	status: Async_Status;
	progress: number;
	resources: Resource[];
	promise: Promise<void> | null;
}

export type Resource = ImageResource | AudioResource;
export type ImageResource = {
	type: 'image';
	url: string;
	status: Async_Status;
	texture: Writable<Texture | null>;
};
export type AudioResource = {
	type: 'audio';
	url: string;
	status: Async_Status;
	audio: HTMLAudioElement | null; // TODO maybe make this a union so `null` appears only with initial status?
};
export type ResourceType = Resource['type'];
export interface ResourceTypes {
	image: ImageResource;
	audio: AudioResource;
}

export const createResourcesStore = (): ResourcesStore => {
	// TODO This promise usage is hacky,
	// but works with current limited API
	// that doesn't support retries or multiple load calls.
	// Maybe use a deferred pattern instead?
	let resolve: () => void;
	let promise: Promise<void> | null = null;

	const store = writable<ResourcesState>({
		status: 'initial',
		progress: 0,
		resources: [],
		promise,
	});
	const {update, subscribe} = store;

	const onLoad = (resourceUrl: string) => {
		let shouldResolve = false;
		update((state) => {
			let successCount = 0;
			const resources: Resource[] = state.resources.map((resource) => {
				if (resource.url === resourceUrl) {
					successCount++;
					return {...resource, status: 'success'};
				}
				if (resource.status === 'success') successCount++;
				return resource;
			});
			const progress = successCount / resources.length;
			if (progress === 1) shouldResolve = true;
			return {
				...state,
				progress,
				status: state.status === 'failure' ? 'failure' : progress === 1 ? 'success' : 'pending',
				resources,
			};
		});
		if (shouldResolve) {
			resolve();
		}
	};

	const onError = (resourceUrl: string) => {
		update((state) => {
			const resources: Resource[] = state.resources.map((resource) => {
				return resource.url === resourceUrl ? {...resource, status: 'failure'} : resource;
			});
			return {
				...state,
				status: 'failure',
				resources,
			};
		});
		resolve();
	};

	return {
		subscribe,
		addResource: (type, url) => {
			let resource: Resource;
			update((state) => {
				if (state.status !== 'initial') {
					// TODO maybe change this API to support this?
					throw Error(`Cannot add resources after loading: ${url}`);
				}
				if (state.resources.find((r) => r.url === url)) {
					throw Error(`Already added resource ${url}`);
				}
				switch (type) {
					case 'image': {
						resource = {type, url, status: 'initial', texture: writable(null)};
						break;
					}
					case 'audio': {
						resource = {type, url, status: 'initial', audio: null};
						break;
					}
					default: {
						throw new Unreachable_Error(type);
					}
				}
				return {...state, resources: state.resources.concat(resource)};
			});
			return resource! as any;
		},
		load: () => {
			if (promise) return promise;
			promise = new Promise<void>((r) => (resolve = r));
			update((state) => {
				const resources: Resource[] = [];
				for (const resource of state.resources) {
					switch (resource.type) {
						case 'image': {
							const loading = Assets.load(resource.url);
							loading.then(
								(loaded) => {
									onLoad(resource.url);
									resource.texture.set(loaded);
								},
								() => onError(resource.url),
							);
							resources.push({...resource, status: 'pending'});
							break;
						}
						case 'audio': {
							const audio = new Audio();
							audio.addEventListener('canplaythrough', () => onLoad(resource.url), {once: true});
							audio.addEventListener('error', () => onError(resource.url), {once: true});
							resources.push({...resource, status: 'pending', audio});
							break;
						}
						default: {
							throw new Unreachable_Error(resource);
						}
					}
				}
				// TODO is this actually needed or can we do it above after the listeners are added?
				// the main question is whether or not it will be synchronously resolved
				// if the resource is in the browser's cache
				setTimeout(() => {
					for (const resource of resources) {
						switch (resource.type) {
							case 'image': {
								break;
							}
							case 'audio': {
								resource.audio!.src = resource.url;
								break;
							}
							default: {
								throw new Unreachable_Error(resource);
							}
						}
					}
				});
				return {
					...state,
					status: 'pending',
					resources,
					promise,
				};
			});
			return promise;
		},
	};
};
