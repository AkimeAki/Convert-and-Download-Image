import type { Format, ImageUrl } from "../lib";

chrome.runtime.onMessage.addListener(async (request: Format & ImageUrl) => {
	const res = await fetch(request.url !== undefined ? request.url : location.href);
	const blob = await res.blob();
	const img = new Image();
	img.src = URL.createObjectURL(blob);
	img.onload = async () => {
		const width = img.width;
		const height = img.height;

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		try {
			const ctx = canvas.getContext("2d");
			ctx!.drawImage(img, 0, 0, width, height);
			const dataURL = canvas.toDataURL(request.type);
			const blob = await (await fetch(dataURL)).blob();
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `image.${request.ext}`;
			link.click();
		} catch (e) {
			/* empty */
		}
	};

	return true;
});
