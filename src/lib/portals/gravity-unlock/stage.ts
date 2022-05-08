// interface EntityData {
// 	id: number;
// }
export interface StageData {
	freezeCamera: boolean;
	playerSpeed: number; // TODO should this be `entities: [{name: 'player'}]`
	// worldWidth: number;
	// worldHeight: number;
	// TODO
	// entities: EntityData[];
}

export const initialStageData: StageData = {
	freezeCamera: true,
	playerSpeed: 0.6,
	// worldWidth: 2560,
	// worldHeight: 1440,
};
