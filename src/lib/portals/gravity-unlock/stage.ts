// interface EntityData {
// 	id: number;
// }
export interface StageData {
	freezeCamera: boolean;
	// worldWidth: number;
	// worldHeight: number;
	// TODO
	// entities: EntityData[];
}

export const initialStageData: StageData = {
	freezeCamera: true,
	// worldWidth: 2560,
	// worldHeight: 1440,
};
