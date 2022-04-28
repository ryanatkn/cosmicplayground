import type {Handle} from '@sveltejs/kit';

// disable SSR because Pixi doesn't like doing that
export const handle: Handle = async ({event, resolve}) => {
	return resolve(event, {ssr: false});
};
