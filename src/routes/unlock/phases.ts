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
	image_meta: ImageMeta;
}

export const to_phase_data = (name: string): PhaseData => {
	const data = phase_data_by_name.get(name);
	if (!data) throw Error('Unknown level: ' + name);
	return data;
};

export const to_phase_datas_by_level_name = (name: string): PhaseData[] => {
	const data = phase_datas_by_level_name.get(name);
	if (!data) throw Error('Unknown stage: ' + name);
	return data;
};

export const to_level_data_by_name = (name: string): LevelData => {
	const data = level_data_by_name.get(name);
	if (!data) throw Error('Unknown stage: ' + name);
	return data;
};

export const to_phase_data_by_level_name = (levelName: string): LevelData =>
	to_level_data_by_name(levelName.slice(0, -1));

export const level_data_by_name: Map<string, LevelData> = new Map(
	[
		{name: '0', image: 'heic0506a'},
		{name: '1', image: 'opo0501a'},
		{name: '2', image: 'opo0415a'},
		{name: '3', image: 'heic1913c'},
		{name: '4', image: 'heic0910i'},
		{name: '5', image: 'heic2002a'},
		{name: '6', image: 'heic1712a'},
		{name: '7', image: 'heic1712a'},
		{name: '8', image: 'heic0817a'},
		{name: '9', image: 'heic1302a'},
		{name: '10', image: 'heic1107a'},
	].map((v) => {
		(v as unknown as LevelData).image_meta = toImageMeta(v.image);
		return [v.name, v as unknown as LevelData];
	}),
);

// TODO could add "sugar", 0-1, and sort by it on atlas
export const phase_data_by_name: Map<string, PhaseData> = new Map(
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
			song: 'Adventures of Flying Jack',
			image: 'heic0506a',
		},
		{name: '1a', phase: 0, title: 'Piña Colada', song: 'Piña Colada', image: 'opo0501a'},
		{name: '1b', phase: 0, title: 'Chronos', song: 'Chronos', image: 'opo0501a'},
		{name: '1c', phase: 1, title: 'Mint Condition', song: 'Mint Condition', image: 'opo0501a'},
		{name: '1d', phase: 1, title: 'Hit n Smash', song: 'Hit n Smash', image: 'opo0501a'},
		{name: '2a', phase: 0, title: 'Flutter', song: 'Flutter', image: 'opo0415a'},
		{name: '2b', phase: 0, title: 'Chemical X', song: 'Chemical X', image: 'opo0415a'},
		{name: '2c', phase: 1, title: 'Frost', song: 'Frost', image: 'opo0415a'},
		{name: '2d', phase: 1, title: 'Dominant', song: 'Dominant', image: 'opo0415a'},
		{name: '3a', phase: 0, title: 'Blacksmith', song: 'Blacksmith', image: 'heic1913c'},
		{name: '3b', phase: 0, title: 'The Crown', song: 'The Crown', image: 'heic1913c'},
		{name: '3c', phase: 1, title: 'Bhangra Bass', song: 'Bhangra Bass', image: 'heic1913c'},
		{name: '3d', phase: 1, title: 'Spacebuckler', song: 'Spacebuckler', image: 'heic1913c'},
		{name: '4a', phase: 0, title: 'Brewing Potions', song: 'Brewing Potions', image: 'heic0910i'},
		{name: '4b', phase: 0, title: "He's a Parrot", song: "He's a Parrot", image: 'heic0910i'},
		{name: '4c', phase: 1, title: 'Celebration', song: 'Celebration', image: 'heic0910i'},
		{name: '4d', phase: 1, title: 'Forest Night', song: 'Forest Night', image: 'heic0910i'},
		{name: '4e', phase: 1, title: 'Land Ho', song: 'Land Ho', image: 'heic0910i'},
		{name: '5a', phase: 0, title: 'Be Chillin', song: 'Be Chillin', image: 'heic2002a'},
		{name: '5b', phase: 0, title: 'Painting Room', song: 'Painting Room', image: 'heic2002a'},
		{name: '5c', phase: 1, title: 'VHS Heroes', song: 'VHS Heroes', image: 'heic2002a'},
		{name: '5d', phase: 1, title: 'La Citadelle', song: 'La Citadelle', image: 'heic2002a'},
		{name: '6a', phase: 0, title: 'Grid', song: 'Grid', image: 'heic1712a'},
		{name: '6b', phase: 0, title: 'Journey of Hope', song: 'Journey of Hope', image: 'heic1712a'},
		{name: '6c', phase: 1, title: 'Rush', song: 'Rush', image: 'heic1712a'},
		{
			name: '6d',
			phase: 1,
			title: 'Inteficial Artelligence',
			song: 'Inteficial Artelligence',
			image: 'heic1712a',
		},
		{name: '7a', phase: 0, title: 'Jotunheim', song: 'Jotunheim', image: 'heic1712a'},
		{name: '7b', phase: 0, title: 'Bleu', song: 'Bleu', image: 'heic1712a'},
		{name: '7d', phase: 1, title: 'Flynyrd Mynyrd', song: 'Flynyrd Mynyrd', image: 'heic1712a'},
		{name: '7c', phase: 1, title: 'Desert Fox', song: 'Desert Fox', image: 'heic1712a'},
		{name: '8a', phase: 0, title: 'The Expanse', song: 'The Expanse', image: 'heic0817a'},
		{name: '8b', phase: 0, title: 'Facing Storm', song: 'Facing Storm', image: 'heic0817a'},
		{name: '8d', phase: 1, title: 'Catharsis', song: 'Catharsis', image: 'heic0817a'},
		{name: '8c', phase: 1, title: 'Lonely Mountain', song: 'Lonely Mountain', image: 'heic0817a'},
		{name: '9a', phase: 0, title: 'Fireworks', song: 'Fireworks', image: 'heic1302a'},
		{name: '9b', phase: 0, title: 'The Desert', song: 'The Desert', image: 'heic1302a'},
		{name: '9d', phase: 1, title: 'Alive', song: 'Alive (Instrumental)', image: 'heic1302a'},
		{name: '9c', phase: 1, title: 'Assassin', song: 'Assassin', image: 'heic1302a'},
		{name: '10a', phase: 0, title: 'Shining Stars', song: 'Shining Stars', image: 'heic1107a'},
		{name: '10c', phase: 0, title: 'Life', song: 'Life', image: 'heic1107a'},
		{name: '10b', phase: 0, title: 'Nomadic Sunset', song: 'Nomadic Sunset', image: 'heic1107a'},
		{name: '10d', phase: 1, title: 'Chemical Z', song: 'Chemical Z', image: 'heic1107a'},
		{name: '10e', phase: 1, title: 'Dream', song: 'Dream', image: 'heic1107a'},
		{name: '10f', phase: 1, title: 'Terra Mystica', song: 'Terra Mystica', image: 'heic1107a'},
	].map((v) => {
		(v as unknown as PhaseData).song = lookup_song(v.song);
		(v as unknown as PhaseData).stage = to_phase_data_by_level_name(v.name);
		return [v.name, v as unknown as PhaseData];
	}),
);

const phase_datas_by_level_name = new Map<string, PhaseData[]>();
for (const phase_data of phase_data_by_name.values()) {
	const stage = to_phase_data_by_level_name(phase_data.name);
	let phase_datas = phase_datas_by_level_name.get(stage.name);
	if (!phase_datas) phase_datas_by_level_name.set(stage.name, (phase_datas = []));
	phase_datas.push(phase_data);
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
export const phase_sequences: PhaseSequenceOrCreator[] = [
	{
		name: 'sugar_pure',
		data: {
			sequence: [
				'0a',
				'1a',
				'2a',
				'3a',
				'4a',
				'4c',
				'5a',
				'6a',
				'7a',
				'8a',
				'9a',
				'9c',
				'10a',
				'10d',
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
				'4d',
				'5a',
				'5c',
				'6a',
				'6c',
				'7a',
				'7d',
				'8a',
				'8d',
				'9a',
				'9d',
				'10c',
				'10e',
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
				'4e',
				'5b',
				'6b',
				'7b',
				'8b',
				'9b',
				'9c',
				'10b',
				'10f',
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
				'2d',
				'3b',
				'3d',
				'4b',
				randomItem(['4d', '4e']),
				'5b',
				'5d',
				'6b',
				'6d',
				'7b',
				'7c',
				'8b',
				'8c',
				'9b',
				'9c',
				'10b',
				randomItem(['10e', '10f']),
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
					['4a', '4d'],
					['4b', '4e'],
				]),
				randomItem(['5a', '5b']),
				randomItem(['6a', '6b']),
				randomItem(['7a', '7b']),
				randomItem(['8a', '8b']),
				randomItem([
					['9a', '9c', '10a', '10d'],
					['9b', '9c', '10b', '10f'],
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
				randomItem(['2c', '2d']),
				randomItem(['3a', '3b']),
				randomItem(['3c', '3d']),
				randomItem([
					['4a', '4d'],
					['4b', '4c', '4e'],
				]),
				randomItem(['5a', '5b']),
				randomItem(['5c', '5d']),
				randomItem(['6a', '6b']),
				randomItem(['6c', '6d']),
				randomItem(['7a', '7b']),
				randomItem(['7c', '7d']),
				randomItem([
					['8a', '8d'],
					['8b', '8c'],
				]),
				randomItem([
					// TODO should be weighted or enabled by how many balance points accumulated before this
					['9a', '9c', '10a', '10d'],
					['9a', '9d', '10c', '10e'],
					['9b', '9c', '10b', '10f'],
				]),
			].flat(),
		}),
	},
	{
		name: 'random_random',
		data: (): PhaseSequenceData => {
			/*

		Conditions that disallow 11e:
		
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
			addPhase(randomItem(['2c', '2d']));
			addPhase(randomItem(['3a', '3b']));
			// had to suppress reaction at least once to get this option
			addPhase(
				randomItem([cCount > MIN_C_COUNT_FOR_3_TIER2 ? randomItem(['3c', '3d']) : null, null]),
			);
			addPhase(
				randomItem([
					['4a', '4d'],
					['4b', cCount > MIN_C_COUNT_FOR_4C ? randomItem(['4c', null]) : null, '4e'],
				]),
			);
			addPhase(randomItem(['5a', '5b']));
			addPhase(randomItem(['5c', '5d']));
			addPhase(randomItem(['6a', '6b']));
			addPhase(randomItem(['6c', '6d']));
			addPhase(randomItem(['7a', '7b']));
			addPhase(randomItem(['7c', '7d', null]));
			addPhase(randomItem(['8a', '8b']));
			addPhase(randomItem(['8c', '8d', null]));
			addPhase(
				randomItem(
					[
						['9a', '9c', '10a', '10d'],
						cCount >= MIN_C_COUNT_FOR_BALANCED_ENDING && bCount <= MAX_B_COUNT_FOR_BALANCED_ENDING
							? ['9a', '9d', '10c', '10e']
							: null,
						['9b', '9c', '10b', '10f'],
					].filter(Boolean),
				),
			);
			return {sequence};
		},
	},
];
export const phase_sequences_by_name: Map<string, PhaseSequenceOrCreator> = new Map(
	phase_sequences.map((l) => [l.name, l]),
);

export const sequenceContains = (phase_sequence: PhaseSequence, phase: PhaseData): boolean =>
	phase_sequence.data.sequence.includes(phase.name);

// TODO maybe do this differently, specific level outcomes integrated with the store?
const MIN_C_COUNT_FOR_3_TIER2 = 1;
const MIN_C_COUNT_FOR_4C = 1;
const MIN_C_COUNT_FOR_BALANCED_ENDING = 4;
const MAX_B_COUNT_FOR_BALANCED_ENDING = 7;
