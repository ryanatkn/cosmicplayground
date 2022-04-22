import {toImageMeta, type ImageMeta} from '$lib/app/images';
import {type SongData, toSongData} from '$lib/music/songs';

// TODO probably rename Stage to Realm or something, each Level should have a Stage,
// and maybe rename Level so there's Level 1a and 1b etc, then what are each sublevels? Sublevels?

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
		{name: '9a', title: 'The Expanse', song: 'The Expanse', image: 'heic1105a'},
		{name: '9b', title: 'The Desert', song: 'The Desert', image: 'heic1105a'},
		{name: '9c', title: 'Assassin', song: 'Assassin', image: 'heic1105a'},
		{name: '10a', title: 'Fireworks', song: 'Fireworks', image: 'heic1107a'},
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

export interface LevelSequence {
	name: string;
	sequence: string[];
}
export const levelSequencesByName: Map<string, LevelSequence> = new Map(
	[
		{
			name: 'light_pure',
			sequence: ['0a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12a'],
		},
		{
			name: 'light_balanced',
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
				'4c',
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
				'10c',
				'11a',
				'12c',
			],
		},
		{
			name: 'dark_pure',
			sequence: ['0b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '10b', '11b', '12b'],
		},
		{
			name: 'dark_balanced',
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
				'12c',
			],
		},
		// TODO randomly generate the sequence -- maybe make it an `Array | (random)=>Array`?
		// {name: 'light_mixed', sequence: ['0a']},
	].map((s) => [s.name, s]),
);
export const levelSequences = Array.from(levelSequencesByName.values());
