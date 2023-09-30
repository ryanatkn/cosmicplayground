import type {Entity} from '$lib/flat/entity.js';

export interface Renderer {
	resize: (width: number, height: number) => void;
	clear: () => void;
	render: (entities: Iterable<Entity>) => void;
}
