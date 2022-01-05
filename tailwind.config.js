module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-image': 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.60)), url("https://pixelpoly.co/assets/img/portfolio/ctf.png")',
    },
  },
  },
  plugins: [
    require('tailwindcss-textshadow')
  ],
}
