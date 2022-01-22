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
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        mulish: ["Mulish", "sans-serif"],

    },
  },
    
  },
  plugins: [require("tailwindcss-textshadow"), require('tailwindcss-font-inter')],
};
