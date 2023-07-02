/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: "Inter, sans-serif",
      },
      screens: {
        xs: "590px",
        mdlg: "875px",
      },
    },
  },
  plugins: [],
};
