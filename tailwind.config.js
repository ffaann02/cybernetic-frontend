/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio:{
        '1/1': '1 / 1',
      }
    },
    fontFamily:{
      ibm: ['IBM Plex Sans Thai', 'sans-serif'],
    }

  },
}