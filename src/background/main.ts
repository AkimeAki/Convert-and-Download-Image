import { formatList } from "../lib";
import type { Format, ImageUrl } from "../lib";

async function getCurrentTab() {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

chrome.runtime.onMessage.addListener((request: Format) => {
	getCurrentTab().then((currentTab) => {
		const currentTabId = currentTab.id;
		if (currentTabId === undefined) {
			return;
		}

		const imageData: Format & ImageUrl = { url: undefined, ...request };
		chrome.tabs.sendMessage(currentTabId, imageData).catch(() => {});
	});

	return true;
});

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
	const currentTabId = currentTab.id;
	if (currentTabId === undefined) {
		return;
	}

	formatList.forEach((item) => {
		const imageData: Format & ImageUrl = { url: info.srcUrl, ...item };

		if (info.menuItemId === `download-${item.id}`) {
			chrome.tabs.sendMessage(currentTabId, imageData).catch(() => {});
		}
	});
});
