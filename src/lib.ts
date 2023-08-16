export interface ImageUrl {
	url?: string;
}

export interface Format {
	name: string;
	id: string;
	type: string;
	ext: string;
}

export const formatList: Format[] = [
	{
		name: "PNG",
		id: "png",
		type: "image/png",
		ext: "png"
	},
	{
		name: "JPEG",
		id: "jpeg",
		type: "image/jpeg",
		ext: "jpg"
	},
	{
		name: "WebP",
		id: "webp",
		type: "image/webp",
		ext: "webp"
	}
];
