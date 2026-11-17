/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          strawberry: '#F27F9D',
          soft: '#F9C3D0',
          hot: '#F04478',
          crimson: '#C51F46',
          black: '#171316',
          ivory: '#FFF4E9',
          coral: '#FF765F',
          lavender: '#DCC8F5',
          lime: '#C5D83C',
          cream: '#FFF9F5',
          lightpink: '#FFF0F3',
          border: '#F8B4C4',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        script: ['"Alex Brush"', 'cursive'],
        editorial: ['"Cormorant Garamond"', 'serif']
      },
      boxShadow: {
        'scrapbook': '4px 4px 0px 0px #171316',
        'scrapbook-sm': '2px 2px 0px 0px #171316',
        'scrapbook-pink': '4px 4px 0px 0px #C51F46',
        'soft-glow': '0 8px 30px rgba(242, 127, 157, 0.25)',
      },
      backgroundImage: {
        'gingham-pink': "repeating-linear-gradient(0deg, rgba(249, 195, 208, 0.35) 0px, rgba(249, 195, 208, 0.35) 15px, transparent 15px, transparent 30px), repeating-linear-gradient(90deg, rgba(249, 195, 208, 0.35) 0px, rgba(249, 195, 208, 0.35) 15px, #FFF4E9 15px, #FFF4E9 30px)",
      }
    },
  },
  plugins: [],
}
