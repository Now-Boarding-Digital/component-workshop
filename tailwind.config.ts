/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add your design tokens here as the session progresses
      // e.g. colors, spacing, typography from Figma
      colors: {},
      fontFamily: {},
      spacing: {},
    },
  },
  plugins: [],
}
