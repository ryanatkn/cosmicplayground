import {type Stage, type StageConstructor} from '$lib/flat/stage';

export interface StageState {
	stage: Stage | null;
	stageConstructor: StageConstructor;
	unlocked: boolean;
	completions: StageStats[];
}

export interface StageStats {
	time: number;
}
