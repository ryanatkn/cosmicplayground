import {DEFAULT_STRENGTH, DEFAULT_TIME_DILATION} from '@ryanatkn/dealt';

// interface EntityData {
// 	id: number;
// }

// TODO rename this? maybe `StageDefData`? `StageDef`? `StageWad`?
export interface StageData {
	freezeCamera: boolean;
	playerSpeed: number; // TODO should this be `entities: [{name: 'player'}]`
	playerStrength: number; // TODO should this be `entities: [{name: 'player'}]`
	timeDilation: number;
	// worldWidth: number;
	// worldHeight: number;
	// TODO
	// entities: EntityData[];
}

export const initialStageData: StageData = {
	freezeCamera: false,
	playerSpeed: 0.6,
	playerStrength: DEFAULT_STRENGTH,
	timeDilation: DEFAULT_TIME_DILATION,
	// worldWidth: 2560,
	// worldHeight: 1440,
};
