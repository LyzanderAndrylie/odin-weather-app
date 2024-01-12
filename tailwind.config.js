/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/templates/*.html', './src/**/*.{html,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
