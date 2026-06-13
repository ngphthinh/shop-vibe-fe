/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Khai báo này giúp Tailwind quét toàn bộ file trong thư mục src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
