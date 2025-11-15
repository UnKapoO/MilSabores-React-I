/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      'principal': ['Lato', 'sans-serif'],
      'secundaria': ['Pacifico', 'cursive'],
    },
    extend: {
      colors: {
        'fondo-crema': '#FFF5E1',
        'acento-rosa': '#FFC0CB',
        'acento-cafe': '#8B4513',
        'letra-cafe': '#5D4037',
        'letra-gris': '#B0BEC5',
        
        'primary': '#d4a574',
        'dark': '#2c1810'
      },
    },
  },
  plugins: [],
}

