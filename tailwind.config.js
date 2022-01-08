module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFeatureSettings: {
      numeric: ['ss02']
    },
    extend: {
      backgroundImage: {
        "hero-image":
          ' url("https://pixelpoly.co/assets/img/portfolio/ctf.png")',
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
    },
  },
    
  },
  plugins: [require("tailwindcss-textshadow"), require('tailwindcss-font-inter')],
};
