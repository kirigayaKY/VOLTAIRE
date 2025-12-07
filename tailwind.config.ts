/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'voltaire-green': '#1a5d3d',
        'voltaire-dark': '#0f3d25',
        'prestige-gold': '#d4a574'
      }
    },
  },
  plugins: [],
}
