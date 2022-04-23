import {randomItem} from '@feltcoop/felt/util/random.js';

import {toImageMeta, type ImageMeta} from '$lib/app/images';
import {type SongData, toSongData} from '$lib/music/songs';

// TODO BLOCK probably rename Stage to World

export interface LevelData {
	name: string;
	title: string;
	stage: StageData;
	song: SongData;
}

export interface StageData {
	name: string;
	image: string;
	imageMeta: ImageMeta;
}

export const toLevelData = (name: string): LevelData => {
	const data = levelDatas.get(name);
	if (!data) throw Error('Unknown level: ' + name);
	return data;
};

export const toLevelDatasByStageName = (name: string): LevelData[] => {
	const data = levelDatasByStageName.get(name);
	if (!data) throw Error('Unknown stage: ' + name);
	return data;
};

export const toStageDataByName = (name: string): StageData => {
	const data = stageDatas.get(name);
	if (!data) throw Error('Unknown stage: ' + name);
	return data;
};

export const toStageDataByLevelName = (levelName: string): StageData =>
	toStageDataByName(levelName.slice(0, -1));

export const stageDatas: Map<string, StageData> = new Map(
	[
		{name: '0', image: 'heic0206a'},
		{name: '1', image: 'heic0406a'},
		{name: '2', image: 'heic0506a'},
		{name: '3', image: 'heic0707a'},
		{name: '4', image: 'heic0814a'},
		{name: '5', image: 'heic0817a'},
		{name: '6', image: 'heic0910e'},
		{name: '7', image: 'heic1712a'},
		{name: '8', image: 'heic1007a'},
		{name: '9', image: 'heic1105a'},
		{name: '10', image: 'heic1107a'},
		{name: '11', image: 'heic1118a'},
		{name: '12', image: 'heic1302a'},
	].map((v) => {
		(v as unknown as StageData).imageMeta = toImageMeta(v.image);
		return [v.name, v as unknown as StageData];
	}),
);

export const levelDatas: Map<string, LevelData> = new Map(
	[
		{name: '0a', title: 'Traveler', song: 'Traveler', image: 'heic0206a'},
		{
			name: '0b',
			title: 'Adventures of Flying Jack',
			song: 'Main Theme (Adventures of Flying Jack)',
			image: 'heic0206a',
		},
		{name: '0c', title: 'Adventure', song: 'Adventure', image: 'heic0206a'},
		{name: '1a', title: 'Piña Colada', song: 'Piña Colada', image: 'heic0406a'},
		{name: '1b', title: 'La Citadelle', song: 'La Citadelle', image: 'heic0406a'},
		{name: '1c', title: 'Chronos', song: 'Chronos', image: 'heic0406a'},
		{name: '2a', title: 'Chemical X', song: 'Chemical X', image: 'heic0506a'},
		{name: '2b', title: 'Celebration', song: 'Celebration', image: 'heic0506a'},
		{name: '2c', title: 'Flynyrd Mynyrd', song: 'Flynyrd Mynyrd', image: 'heic0506a'},
		{name: '3a', title: 'Blacksmith', song: 'Blacksmith', image: 'heic0707a'},
		{name: '3b', title: 'The Crown', song: 'The Crown', image: 'heic0707a'},
		{name: '3c', title: 'Bouchedag', song: 'Bouchedag', image: 'heic0707a'},
		{name: '4a', title: 'Brewing Potions', song: 'Brewing Potions', image: 'heic0814a'},
		{name: '4b', title: 'Hit n Smash', song: 'Hit n Smash', image: 'heic0814a'},
		{name: '4c', title: 'Fanfare X', song: 'Fanfare X', image: 'heic0814a'},
		{name: '5a', title: 'Forest Night', song: 'Forest Night', image: 'heic0817a'},
		{name: '5b', title: 'Land Ho', song: 'Land Ho', image: 'heic0817a'},
		{name: '6a', title: 'Be Chillin', song: 'Be Chillin', image: 'heic0910e'},
		{name: '6b', title: 'Painting Room', song: 'Painting Room', image: 'heic0910e'},
		{name: '6c', title: 'Parhelion', song: 'Parhelion', image: 'heic0910e'},
		{name: '7a', title: 'Grid', song: 'Grid', image: 'heic1712a'},
		{name: '7b', title: 'Journey of Hope', song: 'Journey of Hope', image: 'heic1712a'},
		{name: '7c', title: 'Rush', song: 'Rush', image: 'heic1712a'},
		{name: '8a', title: 'Jotunheim', song: 'Jotunheim', image: 'heic1007a'},
		{name: '8b', title: 'Bleu', song: 'Bleu', image: 'heic1007a'},
		{name: '8c', title: 'Desert Fox', song: 'Desert Fox', image: 'heic1007a'},
		{name: '9a', title: 'Fireworks', song: 'Fireworks', image: 'heic1107a'},
		{name: '9b', title: 'The Desert', song: 'The Desert', image: 'heic1105a'},
		{name: '9c', title: 'Assassin', song: 'Assassin', image: 'heic1105a'},
		{name: '10a', title: 'The Expanse', song: 'The Expanse', image: 'heic1105a'},
		{name: '10b', title: 'Facing Storm', song: 'Facing Storm', image: 'heic1107a'},
		{name: '10c', title: 'Lonely Mountain', song: 'Lonely Mountain', image: 'heic1107a'},
		{name: '11a', title: 'Shining Stars', song: 'Shining Stars', image: 'heic1118a'},
		{name: '11b', title: 'Nomadic Sunset', song: 'Nomadic Sunset', image: 'heic1118a'},
		{name: '12a', title: 'Chemical Z', song: 'Chemical Z', image: 'heic1302a'},
		{name: '12b', title: 'Terra Mystica', song: 'Terra Mystica', image: 'heic1302a'},
		{name: '12c', title: 'Dream', song: 'Dream', image: 'heic1302a'},
	].map((v) => {
		(v as unknown as LevelData).song = toSongData(v.song);
		(v as unknown as LevelData).stage = toStageDataByLevelName(v.name);
		return [v.name, v as unknown as LevelData];
	}),
);

const levelDatasByStageName = new Map<string, LevelData[]>();
for (const levelData of levelDatas.values()) {
	const stage = toStageDataByLevelName(levelData.name);
	let levelDatas = levelDatasByStageName.get(stage.name);
	if (!levelDatas) levelDatasByStageName.set(stage.name, (levelDatas = []));
	levelDatas.push(levelData);
}

export type LevelSequenceOrCreator = {
	name: string;
	data: LevelSequenceData | (() => LevelSequenceData);
};
export interface LevelSequence {
	name: string;
	data: LevelSequenceData;
}
export interface LevelSequenceData {
	sequence: string[];
}
export const toLevelSequence = (l: LevelSequenceOrCreator): LevelSequence =>
	typeof l.data === 'function' ? {...l, data: l.data()} : (l as any); // TODO why doesn't this type narrow?
export const levelSequences: LevelSequenceOrCreator[] = [
	{
		name: 'light_pure',
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
		name: 'light_balanced',
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
				'8c',
				'9a',
				'9c',
				'10a',
				'11a',
				'12a',
				'12c',
			],
		},
	},
	{
		name: 'void_pure',
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
		name: 'void_balanced',
		data: {
			sequence: [
				'0b',
				'0c',
				'1b',
				'1c',
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
				'0c',
				randomItem(['1a', '1b']),
				'1c',
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
				'8c',
				randomItem(['9a', '9b']),
				'9c',
				randomItem([
					['10a', '10c', '11a', '12a'],
					['10a', '11a', '12a', '12c'], // TODO this relies on earlier events (what are they? maybe ~half of the c levels must be completed?)
					['10b', '10c', '11b', '12b'],
				]),
			].flat(),
		}),
	},
	{
		name: 'random_random',
		data: (): LevelSequenceData => {
			/*

		Conditions that disallow 12c:
		
		- not enough balance (full a+c's is ok, maybe need more c's in that case, or perhaps it's naturally balanced because some c's  )
		- too much void

		*/
			const sequence: string[] = [];
			let aCount = 0;
			let bCount = 0;
			let cCount = 0;
			const addOneLevel = (name: string | null): void => {
				if (!name) return;
				if (name.endsWith('a')) {
					aCount++;
				} else if (name.endsWith('b')) {
					bCount++;
				} else if (name.endsWith('c')) {
					cCount++;
				} else {
					console.error('unexpected level name', name);
				}
				sequence.push(name);
			};
			const addLevel = (names: string | null | Array<string | null>): void => {
				if (Array.isArray(names)) {
					names.forEach(addOneLevel);
				} else {
					addOneLevel(names);
				}
			};
			addLevel(randomItem(['0a', '0b']));
			addLevel(randomItem(['0c', null]));
			addLevel(randomItem(['1a', '1b']));
			addLevel(randomItem(['1c', null]));
			addLevel(randomItem(['2a', '2b']));
			addLevel(randomItem(['2c', null]));
			addLevel(randomItem(['3a', '3b']));
			addLevel(randomItem(['3c', null]));
			addLevel(
				randomItem([
					['4a', '5a'],
					['4b', cCount > 1 ? randomItem(['4c', null]) : null, '5b'], // TODO is 1 good?
				]),
			);
			addLevel(randomItem(['6a', '6b']));
			addLevel(randomItem(['6c', null]));
			addLevel(randomItem(['7a', '7b']));
			addLevel(randomItem(['7c', null]));
			addLevel(randomItem(['8a', '8b']));
			addLevel(randomItem(['8c', null]));
			addLevel(randomItem(['9a', '9b']));
			addLevel(randomItem(['9c', null]));
			addLevel(
				randomItem(
					[
						['10a', '10c', '11a', '12a'],
						cCount >= 4 ? ['10a', '11a', '12a', '12c'] : null, // TODO is 4 good?
						['10b', '10c', '11b', '12b'],
					].filter(Boolean),
				),
			);
			return {sequence};
		},
	},
];
export const levelSequencesByName: Map<string, LevelSequenceOrCreator> = new Map(
	levelSequences.map((l) => [l.name, l]),
);

export const sequenceContains = (levelSequence: LevelSequence, level: LevelData): boolean =>
	levelSequence.data.sequence.includes(level.name);
