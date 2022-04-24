import type {Entity} from '$lib/flat/Entity';
import type {CameraState} from '$lib/flat/camera';

// TODO BLOCK refactor this with the Pixi renderer,
// maybe either remove this or support multiple renderers
export interface Renderer {
	resize: (width: number, height: number) => void;
	clear: () => void;
	render: (entities: Iterable<Entity>, camera: CameraState) => void;
}
