/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "toast-pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { tansform: "scale(1.0)", opacity: "1" },
        },
        "toast-pop-out": {
          "0%": { transform: "scale(1.0)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
      },
      animation: {
        "toast-pop-in": "toast-pop-in 0.3s ease-out",
        "toast-pop-out": "toast-pop-out 0.3s ease-out forwards",
      },
      colors: {
        primary: "#1f1d21",
      },
    },
  },
  plugins: [],
};
