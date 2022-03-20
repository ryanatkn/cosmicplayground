import type {Stage, StageConstructor} from '$lib/flat/stage';

export interface StageState<TStage extends Stage = Stage> {
	stage: TStage | null;
	stageConstructor: StageConstructor;
	unlocked: boolean;
	completions: StageStats[];
}

export interface StageStats {
	time: number;
}
