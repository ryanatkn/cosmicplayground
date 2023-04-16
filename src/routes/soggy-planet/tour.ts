// TODO BLOCK use zod
export interface Point_Of_Interest {
	name: string;
	url: string;
	mythical?: boolean;
}

export const points_of_interest: Point_Of_Interest[] = [
	{name: 'Sundaland', url: 'https://wikipedia.org/wiki/Sundaland'},
	{name: 'Kumari Kandam', url: 'https://wikipedia.org/wiki/Kumari_Kandam', mythical: true},
	{name: 'Lemuria', url: 'https://wikipedia.org/wiki/Lemuria', mythical: true},
	{name: 'Kerguelen Plateau', url: 'https://wikipedia.org/wiki/Kerguelen_Plateau'},
	{name: 'Altai flood', url: 'https://wikipedia.org/wiki/Altai_flood'},
	{
		name: 'Black Sea deluge hypothesis',
		url: 'https://wikipedia.org/wiki/Black_Sea_deluge_hypothesis',
		mythical: true,
	},
	{name: 'Doggerland', url: 'https://wikipedia.org/wiki/Doggerland'},
	{name: 'Ys', url: 'https://wikipedia.org/wiki/Ys', mythical: true},
	{name: 'Thule', url: 'https://wikipedia.org/wiki/Thule', mythical: true},
	{name: 'Missoula floods', url: 'https://wikipedia.org/wiki/Missoula_floods'},
	{name: 'Beringia', url: 'https://wikipedia.org/wiki/Beringia'},
	{name: 'Land bridges of Japan', url: 'https://wikipedia.org/wiki/Land_bridges_of_Japan'},
	{name: 'Mu', url: 'https://wikipedia.org/wiki/Mu_(mythical_lost_continent)', mythical: true},
];

// TODO BLOCK if time before the deadline, include river valleys (probably just labelled when onscreen  and zoomed in enough, no stopping for them)
