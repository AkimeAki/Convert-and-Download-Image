import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { formatList, convertAndDownloadImage, getCurrentTab } from "../lib";

function App() {
	return (
		<Box sx={{ width: "500px" }}>
			<AppBar position="static" sx={{ marginBottom: "5px" }}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
						拡張子を変更して画像を保存
					</Typography>
				</Toolbar>
			</AppBar>
			<Typography component="div" sx={{ textAlign: "center", padding: "10px 0" }}>
				保存したい画像をタブで開いてボタンを教えて下さい
			</Typography>
			<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", padding: "5px" }}>
				{formatList.map((item) => (
					<Button
						variant="contained"
						onClick={async () => {
							const currentTab = await getCurrentTab();
							if (currentTab.id === undefined) {
								return;
							}

							chrome.scripting.executeScript({
								target: { tabId: currentTab.id },
								func: convertAndDownloadImage,
								args: [item.type, item.ext, false]
							});
						}}
						sx={{ textTransform: "none" }}
						key={item.id}
					>
						{item.name}として保存
					</Button>
				))}
				{formatList.map((item) => (
					<Button
						variant="contained"
						onClick={async () => {
							const currentTab = await getCurrentTab();
							if (currentTab.id === undefined) {
								return;
							}

							chrome.scripting.executeScript({
								target: { tabId: currentTab.id },
								func: convertAndDownloadImage,
								args: [item.type, item.ext, true]
							});
						}}
						sx={{ textTransform: "none" }}
						key={item.id}
					>
						{item.name}として保存
						<br />
						(名前を付けて)
					</Button>
				))}
			</Box>
		</Box>
	);
}

export default App;
