import {z} from 'zod';

export const Song = z.object({
	name: z.string(),
	author: z.string(),
	url: z.string(),
	// TODO duration, but as metadata? write a gen file to output data? would allow us to display that info before loading
});
export type Song = z.infer<typeof Song>;

export const songs_by_name: Map<string, Song> = new Map(
	[
		{
			name: 'Spacey Intro',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Spacey_Intro.mp3',
		},
		{
			name: 'Spacey Outro',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Spacey_Outro.mp3',
		},
		{
			name: 'Futuristic 4',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Futuristic_4.mp3',
		},
		{
			name: 'Futuristic 1',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Futuristic_1.mp3',
		},
		{
			name: 'Space Ambience',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Space_Ambience.mp3',
		},
		{
			name: 'Winter',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Winter.mp3',
		},
		{
			name: 'Adventure',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Adventure.mp3',
		},
		{
			name: 'Adventure (Metal Version)',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Adventure_Metal.mp3',
		},
		{
			name: 'Traveler',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Traveler.mp3',
		},
		{
			name: 'Adventures of Flying Jack',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Main_Theme_Adventures_of_Flying_Jack.mp3',
		},
		{
			name: 'Piña Colada',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Piña_Colada.mp3',
		},
		{
			name: 'Chronos',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Chronos.mp3',
		},
		{
			name: 'Mint Condition',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Mint_Condition.mp3',
		},
		{
			name: 'Hit n Smash',
			author: 'Rafael Krux',
			url: '/assets/audio/Rafael_Krux__Hit_n_Smash.mp3',
		},
		{
			name: 'Flutter',
			author: 'Punch Deck',
			url: '/assets/audio/Punch_Deck__Flutter.mp3',
		},
		{
			name: 'Chemical X',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Chemical_X.mp3',
		},
		{
			name: 'Frost',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Frost.mp3',
		},
		{
			name: 'Dominant',
			author: 'Punch Deck',
			url: '/assets/audio/Punch_Deck__Dominant.mp3',
		},
		{
			name: 'Blacksmith',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Blacksmith.mp3',
		},
		{
			name: 'The Crown',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__The_Crown.mp3',
		},
		{
			name: 'Bhangra Bass',
			author: 'Punch Deck',
			url: '/assets/audio/Punch_Deck__Bhangra_Bass.mp3',
		},
		{
			name: 'Spacebuckler',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Spacebuckler.mp3',
		},
		{
			name: 'Brewing Potions',
			author: 'Rafael Krux',
			url: '/assets/audio/Rafael_Krux__Brewing_Potions.mp3',
		},
		{
			name: "He's a Parrot",
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Hes_A_Parrot.mp3',
		},
		{
			name: 'Celebration',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Celebration.mp3',
		},
		{
			name: 'Land Ho',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Land_Ho.mp3',
		},
		{
			name: 'Forest Night',
			author: 'Phase Shift',
			url: '/assets/audio/Phase_Shift_Forest_Night.mp3',
		},
		{
			name: 'Be Chillin',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Be_Chillin.mp3',
		},
		{
			name: 'Painting Room',
			author: 'Kevin MacLeod',
			url: '/assets/audio/Kevin_MacLeod__Painting_Room.mp3',
		},
		{
			name: 'Parhelion',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Parhelion.mp3',
		},
		{
			name: 'La Citadelle',
			author: 'Komiku',
			url: '/assets/audio/Komiku__La_Citadelle.mp3',
		},
		{
			name: 'Inteficial Artelligence',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Inteficial_Artelligence.mp3',
		},
		{
			name: 'Rush',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Rush.mp3',
		},
		{
			name: 'Grid',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Grid.mp3',
		},
		{
			name: 'Journey of Hope',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Journey_of_Hope.mp3',
		},
		{
			name: 'Jotunheim',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Jotunheim.mp3',
		},
		{
			name: 'Bleu',
			author: 'Komiku',
			url: '/assets/audio/Komiku__Bleu.mp3',
		},
		{
			name: 'Desert Fox',
			author: 'Rafael Krux',
			url: '/assets/audio/Rafael_Krux__Desert_Fox.mp3',
		},
		{
			name: 'Flynyrd Mynyrd',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Flynyrd_Mynyrd.mp3',
		},
		{
			name: 'The Expanse',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__The_Expanse.mp3',
		},
		{
			name: 'The Desert',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__The_Desert.mp3',
		},
		{
			name: 'Assassin',
			author: 'Rafael Krux',
			url: '/assets/audio/Rafael_Krux__Assassin.mp3',
		},
		{
			name: 'Alive (Instrumental)',
			author: 'Punch Deck',
			url: '/assets/audio/Punch_Deck__Alive.mp3',
		},
		{
			name: 'Fireworks',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Fireworks.mp3',
		},
		{
			name: 'Facing Storm',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Facing_Storm.mp3',
		},
		{
			name: 'Catharsis',
			author: 'Punch Deck',
			url: '/assets/audio/Punch_Deck__Catharsis.mp3',
		},
		{
			name: 'Lonely Mountain',
			author: 'Rafael Krux',
			url: '/assets/audio/Rafael_Krux__Lonely_Mountain.mp3',
		},
		{
			name: 'Shining Stars',
			author: 'Rafael Krux',
			url: '/assets/audio/Rafael_Krux__Shining_Stars.mp3',
		},
		{
			name: 'Nomadic Sunset',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Nomadic_Sunset.mp3',
		},
		{
			name: 'Life',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Life.mp3',
		},
		{
			name: 'Chemical Z',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Chemical_Z.mp3',
		},
		{
			name: 'Terra Mystica',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Terra_Mystica.mp3',
		},
		{
			name: 'Dream',
			author: 'Alexander Nakarada',
			url: '/assets/audio/Alexander_Nakarada__Dream.mp3',
		},
	].map((v) => [v.name, v]),
);

export const all_songs: Song[] = Array.from(songs_by_name.values());

export const lookup_song = (name: string): Song => {
	const song = songs_by_name.get(name);
	if (!song) throw Error('Unknown song: ' + name);
	return song;
};

const songs_by_name_by_author: Map<string, Song[]> = new Map();
for (const s of songs_by_name.values()) {
	let songs = songs_by_name_by_author.get(s.author);
	if (!songs) {
		songs_by_name_by_author.set(s.author, (songs = []));
	}
	songs.push(s);
}

export const lookup_songs_by_author = (name: string): Song[] => {
	const songs = songs_by_name_by_author.get(name);
	if (!songs) throw Error('Unknown author: ' + name);
	return songs;
};

export const song_authors = Array.from(
	new Set(Array.from(songs_by_name.values()).map((v) => v.author)),
);
