import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { formatList } from "../lib";

function App() {
	return (
		<Box sx={{ width: "300px" }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
						Download Image
					</Typography>
				</Toolbar>
			</AppBar>
			<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", padding: "5px" }}>
				{formatList.map((item) => (
					<Button
						variant="contained"
						onClick={() => {
							chrome.runtime.sendMessage(item, () => {});
						}}
						sx={{ textTransform: "none" }}
					>
						{item.name}
					</Button>
				))}
			</Box>
		</Box>
	);
}

export default App;
