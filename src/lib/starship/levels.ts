import {type SongData, toSongData} from '$lib/app/songs';
import {type ImageData, toImageData} from '$lib/space/images';

export interface LevelData {
	name: string;
	title: string;
	image: string;
	imageData: ImageData;
	song: SongData;
}

export const levelDatas: Map<string, LevelData> = new Map(
	(
		[
			{name: '0a', title: 'Traveler', image: 'heic0206a'},
			{name: '0b', title: 'Adventures of Flying Jack', image: 'heic0206a'},
			{name: '0c', title: 'Adventure', image: 'heic0206a'},
			{name: '1a', title: 'Chronos', image: 'heic0406a'},
			{name: '1b', title: 'Piña Colada', image: 'heic0406a'},
			{name: '1c', title: 'La Citadelle', image: 'heic0406a'},
			{name: '2a', title: 'Flynyrd Mynyrd', image: 'heic0506a'},
			{name: '2b', title: 'Chemical X', image: 'heic0506a'},
			{name: '2c', title: 'Celebration', image: 'heic0506a'},
			{name: '3a', title: 'Blacksmith', image: 'heic0707a'},
			{name: '3b', title: 'The Crown', image: 'heic0707a'},
			{name: '3c', title: 'Bouchedag', image: 'heic0707a'},
			{name: '4a', title: 'Brewing Potions', image: 'heic0814a'},
			{name: '4b', title: 'Hit n Smash', image: 'heic0814a'},
			{name: '4c', title: 'Fanfare X', image: 'heic0814a'},
			{name: '5a', title: 'Land Ho', image: 'heic0817a'},
			{name: '5b', title: 'Forest Night', image: 'heic0817a'},
			{name: '6a', title: 'Be Chillin', image: 'heic0910e'},
			{name: '6b', title: 'Parhelion', image: 'heic0910e'},
			{name: '6c', title: 'Painting Room', image: 'heic0910e'},
			{name: '7a', title: 'Rush', image: 'heic1712a'},
			{name: '7b', title: 'Grid', image: 'heic1712a'},
			{name: '7c', title: 'Journey of Hope', image: 'heic1712a'},
			{name: '8a', title: 'Jotunheim', image: 'heic1007a'},
			{name: '8b', title: 'Bleu', image: 'heic1007a'},
			{name: '8c', title: 'Desert Fox', image: 'heic1007a'},
			{name: '9a', title: 'The Expanse', image: 'heic1105a'},
			{name: '9b', title: 'The Desert', image: 'heic1105a'},
			{name: '9c', title: 'Assassin', image: 'heic1105a'},
			{name: '10a', title: 'Fireworks', image: 'heic1107a'},
			{name: '10b', title: 'Facing Storm', image: 'heic1107a'},
			{name: '10c', title: 'Lonely Mountain', image: 'heic1107a'},
			{name: '11a', title: 'Nomadic Sunset', image: 'heic1118a'},
			{name: '11b', title: 'Shining Stars', image: 'heic1118a'},
			{name: '12a', title: 'Dream', image: 'heic1302a'},
			{name: '12b', title: 'Terra Mystica', image: 'heic1302a'},
			{name: '12c', title: 'Chemical Z', image: 'heic1302a'},
		] as LevelData[]
	).map((v) => {
		v.song = toSongData(v.name);
		v.imageData = toImageData(v.image as any);
		return [v.name, v];
	}),
);

export const toLevelData = (name: string): LevelData => {
	const data = levelDatas.get(name);
	if (!data) throw Error('Unknown level: ' + name);
	return data;
};
