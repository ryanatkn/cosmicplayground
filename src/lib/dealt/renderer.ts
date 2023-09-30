import type {Entity} from './entity.js';

export interface Renderer {
	resize: (width: number, height: number) => void;
	clear: () => void;
	render: (entities: Iterable<Entity>) => void;
}
