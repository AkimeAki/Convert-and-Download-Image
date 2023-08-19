import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: "0.0.0.0"
	},
	root: "./src/",
	build: {
		outDir: "../dist/",
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]"
			},
			input: {
				popup: "./src/popup/popup.html",
				background: "./src/background/main.ts"
			}
		}
	}
});
