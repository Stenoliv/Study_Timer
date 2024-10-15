/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#1f1d21",
				// Define dark mode colors
			},
		},
	},
	plugins: [],
};
