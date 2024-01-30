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

export const convertAndDownloadImage = async (type: string, ext: string, saveas: boolean, url?: string) => {
	try {
		const res = await fetch(url !== undefined ? url : location.href, {
			mode: "cors"
		});

		const blob = await res.clone().blob();
		const byteArray = new Uint8Array(await res.clone().arrayBuffer());

		let currentImageType = "unknown";
		if (byteArray[0] === 255 && byteArray[1] === 216) {
			currentImageType = "image/jpeg";
		} else if (byteArray[0] === 137 && byteArray[1] === 80 && byteArray[2] === 78 && byteArray[3] === 71) {
			currentImageType = "image/png";
		} else if (
			byteArray[0] === 82 &&
			byteArray[1] === 73 &&
			byteArray[2] === 70 &&
			byteArray[3] === 70 &&
			byteArray[8] === 87 &&
			byteArray[9] === 69 &&
			byteArray[10] === 66 &&
			byteArray[11] === 80
		) {
			currentImageType = "image/webp";
		}

		if (currentImageType === type) {
			const link = document.createElement("a");
			const blobUrl = URL.createObjectURL(blob);
			if (saveas) {
				const opts = {
					suggestedName: `image.${ext}`
				};
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const handle = await (window as any).showSaveFilePicker(opts);
				const writable = await handle.createWritable();
				await writable.write(blob);
				await writable.close();
			} else {
				link.href = blobUrl;
				link.download = `image.${ext}`;
				link.click();
			}

			return;
		}

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
				const blobUrl = URL.createObjectURL(blob);
				if (saveas) {
					const opts = {
						suggestedName: `image.${ext}`
					};
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const handle = await (window as any).showSaveFilePicker(opts);
					const writable = await handle.createWritable();
					await writable.write(blob);
					await writable.close();
				} else {
					link.href = blobUrl;
					link.download = `image.${ext}`;
					link.click();
				}
			} catch (e) {
				if (!saveas) {
					alert("対応していない形式か、または別の理由により処理できませんでした。");
				}
			}
		};
	} catch (e) {
		if (url === undefined || url === location.href) {
			alert("画像にアクセスできませんでした。");
		} else {
			if (!saveas) {
				const openNewTab = confirm(
					"画像にアクセスできませんでした。\n新しいタブで画像を開き、右上のアクションボタンからダウンロードしてください。\n新しいタブで開きますか？"
				);

				if (openNewTab) {
					window.open(url, "_blank");
				}
			}
		}
	}
};
