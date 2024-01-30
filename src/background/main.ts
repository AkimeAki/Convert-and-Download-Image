import { formatList, convertAndDownloadImage, getCurrentTab } from "../lib";

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "downloadImage",
		title: "フォーマットを変換して画像を保存",
		contexts: ["image"]
	});

	formatList.forEach((item) => {
		chrome.contextMenus.create({
			type: "normal",
			id: `download-${item.id}`,
			parentId: "downloadImage",
			title: `${item.name}としてダウンロード`,
			contexts: ["image"]
		});
	});

	formatList.forEach((item) => {
		chrome.contextMenus.create({
			type: "normal",
			id: `download-${item.id}-saveas`,
			parentId: "downloadImage",
			title: `${item.name}として名前を付けてダウンロード`,
			contexts: ["image"]
		});
	});
});

chrome.contextMenus.onClicked.addListener(async (info) => {
	const currentTab = await getCurrentTab();

	formatList.forEach((item) => {
		if (currentTab.id === undefined) {
			return;
		}

		if (info.menuItemId === `download-${item.id}`) {
			chrome.scripting.executeScript({
				target: { tabId: currentTab.id },
				func: convertAndDownloadImage,
				args: [item.type, item.ext, false, info.srcUrl]
			});
		}

		if (info.menuItemId === `download-${item.id}-saveas`) {
			chrome.scripting.executeScript({
				target: { tabId: currentTab.id },
				func: convertAndDownloadImage,
				args: [item.type, item.ext, true, info.srcUrl]
			});
		}
	});
});
