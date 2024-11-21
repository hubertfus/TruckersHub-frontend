/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {},
  },
  daisyui: {
      themes: ["winter", "dark"],
  },
  darkMode: ['class', '[data-theme="dark"]'],
  lightMode: ['class', '[data-theme="winter"]'],
  plugins: [require('daisyui'),],
}

