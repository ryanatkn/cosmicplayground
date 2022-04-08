export interface ImageData {
	name: string;
	url: string;
	thumbnail: string;
}

export const imageDatas: Map<string, ImageData> = new Map(
	(
		[
			{name: 'heic0206a'},
			{name: 'heic0406a'},
			{name: 'heic0506a'},
			{name: 'heic0707a'},
			{name: 'heic0814a'},
			{name: 'heic0817a'},
			{name: 'heic0910e'},
			{name: 'heic0910i'},
			{name: 'heic1007a'},
			{name: 'heic1105a'},
			{name: 'heic1107a'},
			{name: 'heic1118a'},
			{name: 'heic1302a'},
			{name: 'heic1307a'},
			{name: 'heic1409a'},
			{name: 'heic1501a'},
			{name: 'heic1509a'},
			{name: 'heic1520a'},
			{name: 'heic1608a'},
			{name: 'heic1712a'},
			{name: 'heic1808a'},
			{name: 'heic1913c'},
			{name: 'heic2002a'},
			{name: 'heic2007a'},
			{name: 'opo0415a'},
			{name: 'opo0501a'},
			{name: 'potw1752b'},
			{name: 'potw1802a'},
			{name: 'potw1849a'},
			{name: 'potw2029a'},
		] as ImageData[]
	).map((v) => {
		v.url = `/assets/space/${v.name}.webp`;
		v.thumbnail = `/assets/space/${v.name}_thumbnail.webp`;
		return [v.name, v];
	}),
);

export const toImageData = (name: string): ImageData => {
	const data = imageDatas.get(name);
	if (!data) throw Error('Unknown image: ' + name);
	return data;
};
