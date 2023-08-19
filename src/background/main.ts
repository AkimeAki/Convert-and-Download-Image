import { formatList, convertAndDownloadImage, getCurrentTab } from "../lib";

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "downloadImage",
		title: "拡張子を変換して画像を保存",
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
				args: [item.type, item.ext, info.srcUrl]
			});
		}
	});
});
