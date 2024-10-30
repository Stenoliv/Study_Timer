import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)), // Set up the alias '@' to point to the 'src' folder
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:5000", // Replace with your backend URL
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""), // Remove '/api' prefix when forwarding to the backend
			},
		},
	},
});
