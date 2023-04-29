import {randomItem} from '@feltjs/util/random.js';

import {toImageMeta, type ImageMeta} from '$lib/app/images';
import {type Song, lookup_song} from '$lib/music/songs';

// TODO rename Stage to what? world, story? hmm

export interface PhaseData {
	name: string;
	phase: number;
	title: string;
	stage: LevelData;
	song: Song;
}

export interface LevelData {
	name: string;
	image: string;
	imageMeta: ImageMeta;
}

export const toPhaseData = (name: string): PhaseData => {
	const data = PhaseDatas.get(name);
	if (!data) throw Error('Unknown level: ' + name);
	return data;
};

export const toPhaseDatasByLevelName = (name: string): PhaseData[] => {
	const data = PhaseDatasByLevelName.get(name);
	if (!data) throw Error('Unknown stage: ' + name);
	return data;
};

export const toLevelDataByName = (name: string): LevelData => {
	const data = LevelDatas.get(name);
	if (!data) throw Error('Unknown stage: ' + name);
	return data;
};

export const toPhaseDataByLevelName = (levelName: string): LevelData =>
	toLevelDataByName(levelName.slice(0, -1));

export const LevelDatas: Map<string, LevelData> = new Map(
	[
		{name: '0', image: 'heic0506a'},
		{name: '1', image: 'opo0501a'},
		{name: '2', image: 'opo0415a'},
		{name: '3', image: 'heic1913c'},
		{name: '4', image: 'heic1302a'},
		{name: '5', image: 'heic0910i'},
		{name: '6', image: 'heic2002a'},
		{name: '7', image: 'heic1712a'},
		{name: '8', image: 'heic1712a'},
		{name: '9', image: 'potw2029a'},
		{name: '10', image: 'heic0817a'},
		{name: '11', image: 'heic0206a'},
		{name: '12', image: 'heic1107a'},
	].map((v) => {
		(v as unknown as LevelData).imageMeta = toImageMeta(v.image);
		return [v.name, v as unknown as LevelData];
	}),
);

// TODO could add "sugar", 0-1, and sort by it on atlas
export const PhaseDatas: Map<string, PhaseData> = new Map(
	[
		{name: '0a', phase: 0, title: 'Adventure', song: 'Adventure', image: 'heic0506a'},
		{
			name: '0b',
			phase: 0,
			title: 'Adventure (Metal Version)',
			song: 'Adventure (Metal Version)',
			image: 'heic0506a',
		},
		{name: '0c', phase: 1, title: 'Traveler', song: 'Traveler', image: 'heic0506a'},
		{
			name: '0d',
			phase: 1,
			title: 'Adventures of Flying Jack',
			song: 'Main Theme (Adventures of Flying Jack)',
			image: 'heic0506a',
		},
		{name: '1a', phase: 0, title: 'Piña Colada', song: 'Piña Colada', image: 'opo0501a'},
		{name: '1b', phase: 0, title: 'La Citadelle', song: 'La Citadelle', image: 'opo0501a'},
		{name: '1c', phase: 1, title: 'Mint Condition', song: 'Mint Condition', image: 'opo0501a'},
		{name: '1d', phase: 1, title: 'Chronos', song: 'Chronos', image: 'opo0501a'},
		{name: '2a', phase: 0, title: 'Chemical X', song: 'Chemical X', image: 'opo0415a'},
		{name: '2b', phase: 0, title: 'Celebration', song: 'Celebration', image: 'opo0415a'},
		{name: '2c', phase: 1, title: 'Frost', song: 'Frost', image: 'opo0415a'},
		{name: '3a', phase: 0, title: 'Blacksmith', song: 'Blacksmith', image: 'heic1913c'},
		{name: '3b', phase: 0, title: 'The Crown', song: 'The Crown', image: 'heic1913c'},
		{name: '3c', phase: 1, title: 'Spacebuckler', song: 'Spacebuckler', image: 'heic1913c'},
		{name: '4a', phase: 0, title: 'Brewing Potions', song: 'Brewing Potions', image: 'heic1302a'},
		{name: '4b', phase: 0, title: 'Hit n Smash', song: 'Hit n Smash', image: 'heic1302a'},
		{name: '4c', phase: 1, title: 'Fanfare X', song: 'Fanfare X', image: 'heic1302a'},
		{name: '5a', phase: 0, title: 'Forest Night', song: 'Forest Night', image: 'heic0910i'},
		{name: '5b', phase: 0, title: 'Land Ho', song: 'Land Ho', image: 'heic0910i'},
		{name: '6a', phase: 0, title: 'Be Chillin', song: 'Be Chillin', image: 'heic2002a'},
		{name: '6b', phase: 0, title: 'Painting Room', song: 'Painting Room', image: 'heic2002a'},
		{name: '6c', phase: 1, title: 'Parhelion', song: 'Parhelion', image: 'heic2002a'},
		{name: '7a', phase: 0, title: 'Grid', song: 'Grid', image: 'heic1712a'},
		{name: '7b', phase: 0, title: 'Journey of Hope', song: 'Journey of Hope', image: 'heic1712a'},
		{name: '7c', phase: 1, title: 'Rush', song: 'Rush', image: 'heic1712a'},
		{name: '8a', phase: 0, title: 'Jotunheim', song: 'Jotunheim', image: 'heic1712a'},
		{name: '8b', phase: 0, title: 'Bleu', song: 'Bleu', image: 'heic1712a'},
		{name: '8d', phase: 1, title: 'Flynyrd Mynyrd', song: 'Flynyrd Mynyrd', image: 'heic1712a'},
		{name: '8c', phase: 1, title: 'Desert Fox', song: 'Desert Fox', image: 'heic1712a'},
		{name: '9a', phase: 0, title: 'Fireworks', song: 'Fireworks', image: 'potw2029a'},
		{name: '9b', phase: 0, title: 'The Desert', song: 'The Desert', image: 'potw2029a'},
		{name: '9d', phase: 1, title: 'Alive', song: 'Alive (Instrumental)', image: 'potw2029a'},
		{name: '9c', phase: 1, title: 'Assassin', song: 'Assassin', image: 'potw2029a'},
		{name: '10a', phase: 0, title: 'The Expanse', song: 'The Expanse', image: 'heic0817a'},
		{name: '10b', phase: 0, title: 'Facing Storm', song: 'Facing Storm', image: 'heic0817a'},
		{name: '10d', phase: 1, title: "He's a Parrot", song: "He's a Parrot", image: 'heic0817a'},
		{name: '10c', phase: 1, title: 'Lonely Mountain', song: 'Lonely Mountain', image: 'heic0817a'},
		{name: '11a', phase: 0, title: 'Shining Stars', song: 'Shining Stars', image: 'heic0206a'},
		{name: '11c', phase: 0, title: 'Life', song: 'Life', image: 'heic0206a'},
		{name: '11b', phase: 0, title: 'Nomadic Sunset', song: 'Nomadic Sunset', image: 'heic0206a'},
		{name: '12a', phase: 0, title: 'Chemical Z', song: 'Chemical Z', image: 'heic1107a'},
		{name: '12c', phase: 0, title: 'Dream', song: 'Dream', image: 'heic1107a'},
		{name: '12b', phase: 0, title: 'Terra Mystica', song: 'Terra Mystica', image: 'heic1107a'},
	].map((v) => {
		(v as unknown as PhaseData).song = lookup_song(v.song);
		(v as unknown as PhaseData).stage = toPhaseDataByLevelName(v.name);
		return [v.name, v as unknown as PhaseData];
	}),
);

const PhaseDatasByLevelName = new Map<string, PhaseData[]>();
for (const PhaseData of PhaseDatas.values()) {
	const stage = toPhaseDataByLevelName(PhaseData.name);
	let PhaseDatas = PhaseDatasByLevelName.get(stage.name);
	if (!PhaseDatas) PhaseDatasByLevelName.set(stage.name, (PhaseDatas = []));
	PhaseDatas.push(PhaseData);
}

export type PhaseSequenceOrCreator = {
	name: string;
	data: PhaseSequenceData | (() => PhaseSequenceData);
};
export interface PhaseSequence {
	name: string;
	data: PhaseSequenceData;
}
export interface PhaseSequenceData {
	sequence: string[];
}
export const toPhaseSequence = (l: PhaseSequenceOrCreator): PhaseSequence =>
	typeof l.data === 'function' ? {...l, data: l.data()} : (l as any); // TODO why doesn't this type narrow?
export const phaseSequences: PhaseSequenceOrCreator[] = [
	{
		name: 'sugar_pure',
		data: {
			sequence: [
				'0a',
				'1a',
				'2a',
				'3a',
				'4a',
				'5a',
				'6a',
				'7a',
				'8a',
				'9a',
				'10a',
				'10c',
				'11a',
				'12a',
			],
		},
	},
	{
		name: 'sugar_balanced',
		data: {
			sequence: [
				'0a',
				'0c',
				'1a',
				'1c',
				'2a',
				'2c',
				'3a',
				'3c',
				'4a',
				'5a',
				'6a',
				'6c',
				'7a',
				'7c',
				'8a',
				'8d',
				'9a',
				'9d',
				'10a',
				'10d',
				'11c',
				'12c',
			],
		},
	},
	{
		name: 'salt_pure',
		data: {
			sequence: [
				'0b',
				'1b',
				'2b',
				'3b',
				'4b',
				'5b',
				'6b',
				'7b',
				'8b',
				'9b',
				'10b',
				'10c',
				'11b',
				'12b',
			],
		},
	},
	{
		name: 'salt_balanced',
		data: {
			sequence: [
				'0b',
				'0d',
				'1b',
				'1d',
				'2b',
				'2c',
				'3b',
				'3c',
				'4b',
				'4c',
				'5b',
				'6b',
				'6c',
				'7b',
				'7c',
				'8b',
				'8c',
				'9b',
				'9c',
				'10b',
				'10c',
				'11b',
				'12b',
			],
		},
	},
	{
		name: 'random_pure',
		data: () => ({
			sequence: [
				randomItem(['0a', '0b']),
				randomItem(['1a', '1b']),
				randomItem(['2a', '2b']),
				randomItem(['3a', '3b']),
				randomItem([
					['4a', '5a'],
					['4b', '5b'],
				]),
				randomItem(['6a', '6b']),
				randomItem(['7a', '7b']),
				randomItem(['8a', '8b']),
				randomItem(['9a', '9b']),
				randomItem([
					['10a', '10c', '11a', '12a'],
					['10b', '10c', '11b', '12b'],
				]),
			].flat(),
		}),
	},
	{
		name: 'random_balanced',
		data: () => ({
			sequence: [
				randomItem(['0a', '0b']),
				randomItem(['0c', '0d']),
				randomItem(['1a', '1b']),
				randomItem(['1c', '1d']),
				randomItem(['2a', '2b']),
				'2c',
				randomItem(['3a', '3b']),
				'3c',
				randomItem([
					['4a', '5a'],
					['4b', '4c', '5b'],
				]),
				randomItem(['6a', '6b']),
				'6c',
				randomItem(['7a', '7b']),
				'7c',
				randomItem(['8a', '8b']),
				randomItem(['8c', '8d']),
				randomItem([
					['9a', '9d'],
					['9b', '9c'],
				]),
				randomItem([
					// TODO should be weighted or enabled by how many balance points accumulated before this
					['10a', '10c', '11a', '12a'],
					['10a', '10d', '11c', '12c'],
					['10b', '10c', '11b', '12b'],
				]),
			].flat(),
		}),
	},
	{
		name: 'random_random',
		data: (): PhaseSequenceData => {
			/*

		Conditions that disallow 12c:
		
		- not enough balance (full a+c's is ok, maybe need more c's in that case, or perhaps it's naturally balanced because some c's  )
		- too much salt

		*/
			const sequence: string[] = [];
			// let aCount = 0;
			let bCount = 0;
			let cCount = 0;
			const addOneLevel = (name: string | null): void => {
				if (!name) return;
				// if (name.endsWith('a')) {
				// 	aCount++;
				// } else
				if (name.endsWith('b')) {
					bCount++;
				} else if (name.endsWith('c')) {
					cCount++;
				}
				sequence.push(name);
			};
			const addPhase = (names: string | null | Array<string | null>): void => {
				if (Array.isArray(names)) {
					names.forEach(addOneLevel);
				} else {
					addOneLevel(names);
				}
			};
			addPhase(randomItem(['0a', '0b']));
			addPhase(randomItem(['0c', '0d']));
			addPhase(randomItem(['1a', '1b']));
			addPhase(randomItem(['1c', '1d']));
			addPhase(randomItem(['2a', '2b']));
			addPhase(randomItem(['2c', null]));
			addPhase(randomItem(['3a', '3b']));
			// had to suppress reaction at least once to get this option
			addPhase(randomItem([cCount > MIN_C_COUNT_FOR_3C ? randomItem(['3c', null]) : null, null]));
			addPhase(
				randomItem([
					['4a', '5a'],
					['4b', cCount > MIN_C_COUNT_FOR_4C ? randomItem(['4c', null]) : null, '5b'],
				]),
			);
			addPhase(randomItem(['6a', '6b']));
			addPhase(randomItem(['6c', null]));
			addPhase(randomItem(['7a', '7b']));
			addPhase(randomItem(['7c', null]));
			addPhase(randomItem(['8a', '8b']));
			addPhase(randomItem(['8c', '8d', null]));
			addPhase(randomItem(['9a', '9b']));
			addPhase(randomItem(['9c', '9d', null]));
			addPhase(
				randomItem(
					[
						['10a', '10c', '11a', '12a'],
						cCount >= MIN_C_COUNT_FOR_BALANCED_ENDING && bCount <= MAX_B_COUNT_FOR_BALANCED_ENDING
							? ['10a', '10d', '11c', '12c']
							: null,
						['10b', '10c', '11b', '12b'],
					].filter(Boolean),
				),
			);
			return {sequence};
		},
	},
];
export const phaseSequencesByName: Map<string, PhaseSequenceOrCreator> = new Map(
	phaseSequences.map((l) => [l.name, l]),
);

export const sequenceContains = (phaseSequence: PhaseSequence, phase: PhaseData): boolean =>
	phaseSequence.data.sequence.includes(phase.name);

// TODO maybe do this differently, specific level outcomes integrated with the store?
const MIN_C_COUNT_FOR_3C = 1;
const MIN_C_COUNT_FOR_4C = 1;
const MIN_C_COUNT_FOR_BALANCED_ENDING = 4;
const MAX_B_COUNT_FOR_BALANCED_ENDING = 7;
