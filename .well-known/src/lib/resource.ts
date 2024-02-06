import {writable, type Readable} from 'svelte/store';
import type {Async_Status} from '@grogarden/util/async.js';
import {Unreachable_Error} from '@grogarden/util/error.js';

/*

This module was quickly thrown together to centralize some basic loading tasks,
but the later introduction of Pixi and its loader makes it redundant.
Pixi's loader API has been difficult to work with for some tasks,
but it's better than this half-baked implementation
and I don't want to go plumbing through Pixi to make it work with an external loader.
So this module should probably be removed, and its usage replaced with Pixi's loader.

*/

// TODO support retries

export interface ResourceStore<T extends Resource = Resource> extends Readable<T> {
	load: () => Promise<void>;
}

export type Resource = ImageResource | AudioResource;
export type ImageResource = {
	type: 'image';
	url: string;
	status: Async_Status;
	image: HTMLImageElement | null; // TODO maybe make this a union so `null` appears only with initial status?
	promise: Promise<void> | null;
};
export type AudioResource = {
	type: 'audio';
	url: string;
	status: Async_Status;
	audio: HTMLAudioElement | null; // TODO maybe make this a union so `null` appears only with initial status?
	promise: Promise<void> | null;
};
export type ResourceType = Resource['type'];
export interface ResourceTypes {
	image: ImageResource;
	audio: AudioResource;
	promise: Promise<void> | null;
}

export const toResourceStore = (type: ResourceType, url: string): ResourceStore => {
	// TODO This promise usage is hacky,
	// but works with current limited API
	// that doesn't support retries or multiple load calls.
	// Maybe use a deferred pattern instead?
	let resolve: () => void;
	let promise: Promise<void> | null = null;

	const store = writable<Resource>(
		type === 'audio'
			? {
					type,
					url,
					status: 'initial',
					audio: null,
					promise,
				}
			: {
					type,
					url,
					status: 'initial',
					image: null,
					promise,
				},
	);
	const {update, subscribe} = store;

	const onLoad = () => {
		update(($v) => ({...$v, status: 'success'}));
		resolve();
	};

	const onError = () => {
		update(($v) => ($v.url === url ? {...$v, status: 'failure'} : $v));
		resolve();
	};

	return {
		subscribe,
		load: () => {
			if (promise) return promise;
			promise = new Promise<void>((r) => (resolve = r));
			update(($v) => {
				switch ($v.type) {
					case 'image': {
						const image = new Image();
						image.addEventListener('load', onLoad, {once: true});
						image.addEventListener('error', onError, {once: true});
						image.src = $v.url;
						return {...$v, status: 'pending', image, promise};
					}
					case 'audio': {
						const audio = new Audio();
						audio.addEventListener('canplaythrough', onLoad, {once: true});
						audio.addEventListener('error', onError, {once: true});
						audio.src = $v.url;
						return {...$v, status: 'pending', audio, promise};
					}
					default: {
						throw new Unreachable_Error($v);
					}
				}
			});
			return promise;
		},
	};
};
