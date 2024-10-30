/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				"pop-in": {
					"0%": { transform: "scale(0.9)", opacity: "0" },
					"100%": { transform: "scale(1.0)", opacity: "1" },
				},
				"pop-out": {
					"0%": { transform: "scale(1.0)", opacity: "1" },
					"100%": { transform: "scale(0.9)", opacity: "0" },
				},
			},
			animation: {
				"pop-in": "pop-in 0.1s ease-in-out",
				"pop-out": "pop-out 0.1s ease-in-out forwards",
			},
			colors: {
				primary: "#141323",
			},
		},
	},
	plugins: [],
};
