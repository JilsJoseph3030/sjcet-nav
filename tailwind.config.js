/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sjcet-maroon': '#800000',
        'sjcet-maroon-light': '#6b1426',
        'sjcet-gold': '#c5a059',
        'sjcet-bg': '#f8f9fa',
      }
    },
  },
  plugins: [],
}
