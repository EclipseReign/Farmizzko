/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        western: {
          primary: '#8B4513',
          secondary: '#CD853F',
          light: '#F4A460',
          dark: '#654321',
          accent: '#D2691E',
        },
        grass: {
          light: '#9ed96f',
          DEFAULT: '#7ec850',
          dark: '#6ab53e',
        },
        sky: {
          light: '#98D8C8',
          DEFAULT: '#87CEEB',
        }
      },
      fontFamily: {
        western: ['Georgia', 'serif'],
      },
      boxShadow: {
        'western': '0 4px 6px rgba(139, 69, 19, 0.3)',
        'western-lg': '0 10px 20px rgba(139, 69, 19, 0.4)',
      }
    },
  },
  plugins: [],
}