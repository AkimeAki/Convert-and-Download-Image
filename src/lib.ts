interface Format {
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

export const getCurrentTab = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab;
};

export const convertAndDownloadImage = async (type: string, ext: string, url?: string) => {
	try {
		const res = await fetch(url !== undefined ? url : location.href, {
			mode: "cors"
		});

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
				const dataURL = canvas.toDataURL(type);
				const blob = await (await fetch(dataURL)).blob();
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.download = `image.${ext}`;
				link.click();
			} catch (e) {
				alert("対応していない形式か、または別の理由により処理できませんでした。");
			}
		};
	} catch (e) {
		if (url === undefined || url === location.href) {
			alert("画像にアクセスできませんでした。");
		} else {
			const openNewTab = confirm(
				"画像にアクセスできませんでした。\n新しいタブで画像を開き、右上のアクションボタンからダウンロードしてください。\n新しいタブで開きますか？"
			);

			if (openNewTab) {
				window.open(url, "_blank");
			}
		}
	}
};
