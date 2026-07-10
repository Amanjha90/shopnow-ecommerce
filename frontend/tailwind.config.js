/** @type {import('tailwindcss').Config} */
module.exports = {
  // Why content: tells Tailwind which files to scan for class names
  // Without this Tailwind won't apply any styles
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}