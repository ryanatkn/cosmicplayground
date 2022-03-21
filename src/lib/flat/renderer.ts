import type {EntityBody} from '$lib/flat/entity';
import type {CameraState} from '$lib/flat/camera';

export interface Renderer {
	resize: (width: number, height: number) => void;
	clear: () => void;
	render: (entities: Iterable<EntityBody>, camera: CameraState) => void;
}
