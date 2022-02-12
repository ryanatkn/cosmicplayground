import {type Entity} from '$lib/flat/entity';

export interface Renderer {
	resize: (width: number, height: number) => void;
	clear: () => void;
	render: (entities: Entity[]) => void;
}
