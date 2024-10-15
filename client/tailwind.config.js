/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f1d21',
        text: {
          DEFAULT: '#f9f9f9',  // Default text color
          primary: '#1DA1F2', // Primary text color
          secondary: '#424242',  // Secondary text color
        },
        // Define dark mode colors
        dark: {
          primary: '#2c2c2c', // Dark mode primary color
          text: {
            DEFAULT: '#e0e0e0', // Dark mode default text color
            primary: '#1DA1F2', // Dark mode primary text color
            secondary: '#b0b0b0', // Dark mode secondary text color
          },
        },
      }
    },
  },
  plugins: [],
}